using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using CodeForge.Api.DTOs.Response;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;

namespace CodeForge.Core.Service
{
    public class Judge0Service : IJudge0Service
    {
        private readonly HttpClient _httpClient;
        private readonly ITestCaseRepository _testCaseRepository;

        private const string BaseUrl = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";
        private const string RapidApiHost = "judge0-ce.p.rapidapi.com";
        private const string RapidApiKey = "237d9ad7efmshbae7ff4afb82237p17d970jsncb2c24bab49e";

        public Judge0Service(HttpClient httpClient, ITestCaseRepository testCaseRepository)
        {
            _httpClient = httpClient;
            _testCaseRepository = testCaseRepository;
        }

        #region Private Helper Methods

        /// Normalize và validate JSON input
        /// Hỗ trợ cả multiple parameters: "[2,7,11,15], 9" → "[[2,7,11,15], 9]"
        private static string NormalizeJson(string json)
        {
            if (string.IsNullOrWhiteSpace(json))
                return "null";

            json = json.Trim();

            // Thử parse trực tiếp
            try
            {
                using var doc = JsonDocument.Parse(json);
                return JsonSerializer.Serialize(doc.RootElement, new JsonSerializerOptions
                {
                    WriteIndented = false
                });
            }
            catch (JsonException)
            {
                // Nếu fail, thử các chiến lược fix

                // 1. Loại bỏ trailing commas
                string cleaned = Regex.Replace(json, @",\s*([}\]])", "$1");

                try
                {
                    using var doc = JsonDocument.Parse(cleaned);
                    return JsonSerializer.Serialize(doc.RootElement);
                }
                catch
                {
                    // 2. Detect multiple parameters (có dấu phẩy ngoài [], {})
                    if (HasMultipleParameters(json))
                    {
                        // Wrap thành array: "a, b, c" → "[a, b, c]"
                        string wrapped = $"[{json}]";

                        try
                        {
                            using var doc = JsonDocument.Parse(wrapped);
                            return JsonSerializer.Serialize(doc.RootElement);
                        }
                        catch
                        {
                            throw new JsonException($"Cannot parse JSON even after wrapping: {json}");
                        }
                    }

                    throw new JsonException($"Cannot parse JSON: {json}");
                }
            }
        }

        /// Kiểm tra xem input có phải là multiple parameters không
        /// VD: "[1,2], 3" → true | "[1,2,3]" → false
        private static bool HasMultipleParameters(string input)
        {
            int depth = 0;
            bool inString = false;
            char prevChar = ' ';

            foreach (char c in input)
            {
                // Handle string literals
                if (c == '"' && prevChar != '\\')
                {
                    inString = !inString;
                }
                else if (!inString)
                {
                    // Track depth of brackets
                    if (c == '[' || c == '{') depth++;
                    else if (c == ']' || c == '}') depth--;

                    // Nếu gặp dấu phẩy ở ngoài cùng (depth = 0) → multiple params
                    else if (c == ',' && depth == 0)
                    {
                        return true;
                    }
                }

                prevChar = c;
            }

            return false;
        }

        /// Escape string cho Python triple quotes
        private static string EscapeForPython(string input)
        {
            return input
                .Replace("\\", "\\\\")
                .Replace("'''", "\\'\\'\\'")
                .Replace("\r", "")
                .Replace("\n", "\\n");
        }

        /// Escape string cho JavaScript backticks
        private static string EscapeForJavaScript(string input)
        {
            return input
                .Replace("\\", "\\\\")
                .Replace("`", "\\`")
                .Replace("${", "\\${")
                .Replace("\r", "")
                .Replace("\n", "\\n");
        }

        /// Escape string cho C++ raw string (ít khi cần nhưng an toàn hơn)
        private static string EscapeForCpp(string input)
        {
            // Raw string literal trong C++ khá an toàn, nhưng cần xử lý )" đặc biệt
            return input.Replace(@")""", @")\""");
        }

        /// Tạo error response chuẩn
        private static Judge0Response CreateErrorResponse(string errorMessage)
        {
            return new Judge0Response
            {
                Stdout = null,
                Stderr = errorMessage,
                CompileOutput = null,
                Time = null,
                Memory = null,
                Status = new Judge0Status
                {
                    Id = 13,
                    Description = "Internal Error"
                },
                Message = errorMessage
            };
        }

        private static int GetLanguageId(string language)
        {
            return language.ToLower() switch
            {
                "python" or "python3" or "py" => 71,        // Python 3.8.1
                "cpp" or "c++" => 54,                        // C++ (GCC 9.2.0)
                "javascript" or "js" or "node" => 63,       // JavaScript (Node.js 12.14.0)
                "java" => 62,                                // Java (OpenJDK 13.0.1)
                "c" => 50,                                   // C (GCC 9.2.0)
                "csharp" or "c#" or "cs" => 51,             // C# (Mono 6.6.0.161)
                "go" or "golang" => 60,                      // Go (1.13.5)
                "rust" => 73,                                // Rust (1.40.0)
                "ruby" or "rb" => 72,                        // Ruby (2.7.0)
                "php" => 68,                                 // PHP (7.4.1)
                "typescript" or "ts" => 74,                  // TypeScript (3.7.4)
                "kotlin" or "kt" => 78,                      // Kotlin (1.3.70)
                "swift" => 83,                               // Swift (5.2.3)
                _ => throw new ArgumentException($"Unsupported language: {language}")
            };
        }

        #endregion

        #region Public Methods

        public static string BuildFullCode(string language, string userCode, string functionName, string inputJson)
        {
            language = language.ToLower();

            // Normalize JSON input
            string normalizedJson = NormalizeJson(inputJson);

            return language switch
            {
                // 🐍 PYTHON
                "python" or "python3" or "py" => BuildPythonCode(userCode, functionName, normalizedJson),

                // ⚙️ C++
                "cpp" or "c++" => BuildCppCode(userCode, functionName, normalizedJson),

                // 💛 JAVASCRIPT
                "javascript" or "js" or "node" => BuildJavaScriptCode(userCode, functionName, normalizedJson),

                // ☕ JAVA
                "java" => BuildJavaCode(userCode, functionName, normalizedJson),

                _ => throw new ArgumentException($"Unsupported language: {language}")
            };
        }

        /// Chạy tất cả test cases cho một submission
        public async Task<List<Judge0Response>> RunAllTestCasesAsync(
            string language,
            string userCode,
            string functionName,
            List<Guid> testCases)
        {
            var results = new List<Judge0Response>();

            foreach (var id in testCases)
            {
                try
                {
                    // Lấy test case từ database
                    var testCase = await _testCaseRepository.GetByIdAsync(id);

                    if (testCase == null)
                    {
                        results.Add(CreateErrorResponse($"TestCase not found: {id}"));
                        continue;
                    }

                    // Validate và clean input
                    if (string.IsNullOrWhiteSpace(testCase.Input))
                    {
                        results.Add(CreateErrorResponse("Empty input"));
                        continue;
                    }

                    string cleanedInput;
                    try
                    {
                        cleanedInput = NormalizeJson(testCase.Input);
                    }
                    catch (JsonException ex)
                    {
                        results.Add(CreateErrorResponse($"Invalid JSON input: {ex.Message}\nOriginal: {testCase.Input}"));
                        continue;
                    }

                    // Build full code
                    string fullCode;
                    try
                    {
                        fullCode = BuildFullCode(language, userCode, functionName, cleanedInput);
                    }
                    catch (Exception ex)
                    {
                        results.Add(CreateErrorResponse($"Code generation error: {ex.Message}"));
                        continue;
                    }

                    // Debug logging (có thể bật/tắt theo môi trường)
#if DEBUG
                    Console.WriteLine($"\n{'=' * 60}");
                    Console.WriteLine($"[TestCase {id}]");
                    Console.WriteLine($"Original Input: {testCase.Input}");
                    Console.WriteLine($"Normalized Input: {cleanedInput}");
                    Console.WriteLine($"Expected Output: {testCase.ExpectedOutput}");
                    Console.WriteLine($"Generated Code:\n{fullCode}");
                    Console.WriteLine($"{'=' * 60}\n");
#endif

                    // Submit code
                    var response = await SubmitAsync(language, fullCode, testCase.ExpectedOutput);
                    results.Add(response);
                }
                catch (Exception ex)
                {
                    results.Add(CreateErrorResponse($"Unexpected error: {ex.Message}\nStackTrace: {ex.StackTrace}"));
                }
            }

            return results;
        }

        /// Submit code đến Judge0 API
        public async Task<Judge0Response> SubmitAsync(string language, string fullCode, string expectedOutput = null)
        {
            try
            {
                int languageId = GetLanguageId(language);

                var payload = new
                {
                    source_code = fullCode,
                    language_id = languageId,
                    stdin = "",
                    expected_output = expectedOutput ?? "",
                    cpu_time_limit = 2.0,       // 2 seconds
                    memory_limit = 128000,      // 128 MB
                    wall_time_limit = 5.0,      // 5 seconds
                    max_file_size = 1024        // 1 MB
                };

                var content = new StringContent(
                    JsonSerializer.Serialize(payload),
                    Encoding.UTF8,
                    "application/json"
                );

                // ✅ Dùng HttpRequestMessage riêng biệt — không đụng vào DefaultRequestHeaders
                using var request = new HttpRequestMessage(HttpMethod.Post, BaseUrl);
                request.Headers.Add("x-rapidapi-host", RapidApiHost);
                request.Headers.Add("x-rapidapi-key", RapidApiKey);
                request.Content = content;

                // Gửi request
                var response = await _httpClient.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    string err = await response.Content.ReadAsStringAsync();
                    return CreateErrorResponse($"Judge0 API Error [{response.StatusCode}]: {err}");
                }

                var json = await response.Content.ReadAsStringAsync();

                var result = JsonSerializer.Deserialize<Judge0Response>(
                    json,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true,
                        AllowTrailingCommas = true,
                        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
                    });

                return result ?? CreateErrorResponse("Null response from Judge0");
            }
            catch (HttpRequestException ex)
            {
                return CreateErrorResponse($"Network error: {ex.Message}");
            }
            catch (TaskCanceledException ex)
            {
                return CreateErrorResponse($"Request timeout: {ex.Message}");
            }
            catch (JsonException ex)
            {
                return CreateErrorResponse($"JSON deserialize error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return CreateErrorResponse($"Unexpected error: {ex.Message}");
            }
        }


        #endregion

        #region Language-Specific Code Builders

        private static string BuildPythonCode(string userCode, string functionName, string inputJson)
        {
            string escaped = EscapeForPython(inputJson);

            return $@"
import json
import sys

{userCode}

if __name__ == '__main__':
    try:
        input_str = '''{escaped}'''
        data = json.loads(input_str)
        
        # Gọi function với đúng format
        if isinstance(data, dict):
            result = {functionName}(**data)
        elif isinstance(data, list):
            result = {functionName}(*data)  
        else:
            result = {functionName}(data)
        
        # Output JSON
        print(json.dumps(result, ensure_ascii=False))
    except json.JSONDecodeError as e:
        print(f'JSON_PARSE_ERROR: {{str(e)}}', file=sys.stderr)
        sys.exit(1)
    except TypeError as e:
        print(f'FUNCTION_CALL_ERROR: {{str(e)}}', file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f'RUNTIME_ERROR: {{str(e)}}', file=sys.stderr)
        sys.exit(1)
";
        }

        private static string BuildCppCode(string userCode, string functionName, string inputJson)
        {
            string escaped = EscapeForCpp(inputJson);

            return $@"
#include <iostream>
#include <string>
#include <nlohmann/json.hpp>

using namespace std;
using json = nlohmann::json;

{userCode}

int main() {{
    try {{
        string inputStr = R""({escaped})"";
        json data = json::parse(inputStr);
        json output;

        // Xử lý theo loại input
        if (data.is_array()) {{
            int size = data.size();
            switch(size) {{
                case 0: output = {functionName}(); break;
                case 1: output = {functionName}(data[0]); break;
                case 2: output = {functionName}(data[0], data[1]); break;
                case 3: output = {functionName}(data[0], data[1], data[2]); break;
                case 4: output = {functionName}(data[0], data[1], data[2], data[3]); break;
                case 5: output = {functionName}(data[0], data[1], data[2], data[3], data[4]); break;
                default:
                    cerr << ""ARGUMENT_ERROR: Too many arguments (max 5)"" << endl;
                    return 1;
            }}
        }} else if (data.is_object()) {{
            output = {functionName}(data);
        }} else {{
            output = {functionName}(data);
        }}

        cout << output.dump() << endl;
        return 0;
    }} catch (json::parse_error& e) {{
        cerr << ""JSON_PARSE_ERROR: "" << e.what() << endl;
        return 1;
    }} catch (json::type_error& e) {{
        cerr << ""TYPE_ERROR: "" << e.what() << endl;
        return 1;
    }} catch (exception& e) {{
        cerr << ""RUNTIME_ERROR: "" << e.what() << endl;
        return 1;
    }}
}}
";
        }

        private static string BuildJavaScriptCode(string userCode, string functionName, string inputJson)
        {
            string escaped = EscapeForJavaScript(inputJson);

            return $@"
{userCode}

(function() {{
    try {{
        const inputStr = `{escaped}`;
        const data = JSON.parse(inputStr);
        
        let result;
        
        // Gọi function với đúng format
        if (Array.isArray(data)) {{
            result = {functionName}(...data);
        }} else if (typeof data === 'object' && data !== null) {{
            result = {functionName}(data);
        }} else {{
            result = {functionName}(data);
        }}
        
        // Output JSON
        console.log(JSON.stringify(result));
    }} catch (e) {{
        if (e instanceof SyntaxError) {{
            console.error('JSON_PARSE_ERROR:', e.message);
        }} else if (e instanceof TypeError) {{
            console.error('FUNCTION_CALL_ERROR:', e.message);
        }} else {{
            console.error('RUNTIME_ERROR:', e.message);
        }}
        process.exit(1);
    }}
}})();
";
        }

        private static string BuildJavaCode(string userCode, string functionName, string inputJson)
        {
            return $@"
import com.google.gson.*;
import java.lang.reflect.*;

{userCode}

public class Main {{
    public static void main(String[] args) {{
        try {{
            Gson gson = new Gson();
            String inputStr = """"""{inputJson}"""""";
            JsonElement data = JsonParser.parseString(inputStr);
            
            Object result;
            
            if (data.isJsonArray()) {{
                JsonArray arr = data.getAsJsonArray();
                // Cần reflection để gọi method với nhiều params
                result = {functionName}(arr);
            }} else if (data.isJsonObject()) {{
                result = {functionName}(data.getAsJsonObject());
            }} else {{
                result = {functionName}(data);
            }}
            
            System.out.println(gson.toJson(result));
        }} catch (JsonSyntaxException e) {{
            System.err.println(""JSON_PARSE_ERROR: "" + e.getMessage());
            System.exit(1);
        }} catch (Exception e) {{
            System.err.println(""RUNTIME_ERROR: "" + e.getMessage());
            System.exit(1);  
        }}
    }}
}}
";
        }

        #endregion
    }
}