using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using AutoMapper;
using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Request;
using CodeForge.Api.DTOs.Response;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;
using CodeForge.Infrastructure.Repositories;

namespace CodeForge.Core.Service
{
    public class Judge0Service : IJudge0Service
    {
        private readonly HttpClient _httpClient;
        private readonly ITestCaseRepository _testCaseRepository;
        private readonly IProblemRepository _problemRepository;
        private readonly ISubmissionRepository _submissionRepository;
        private readonly IMapper _mapper;

        private const string BaseUrl = "https://judge0-ce.p.rapidapi.com/submissions";
        private const string RapidApiHost = "judge0-ce.p.rapidapi.com";
        private static readonly string RapidApiKey = Environment.GetEnvironmentVariable("RapidApiKey");


        private static readonly Regex NameColonTypePattern = new(@"^(\w+)\s*:\s*(.+)$", RegexOptions.Compiled);
        private static readonly Regex TypeSpaceNamePattern = new(@"^(.+?)\s+(\w+)$", RegexOptions.Compiled);
        private static readonly Regex PublicClassPattern = new(@"\bpublic\s+class\s+", RegexOptions.Compiled);

        public Judge0Service(
            HttpClient httpClient,
            ITestCaseRepository testCaseRepository,
            IProblemRepository problemRepository,
            ISubmissionRepository submissionRepository,
            IMapper mapper)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            _testCaseRepository = testCaseRepository ?? throw new ArgumentNullException(nameof(testCaseRepository));
            _problemRepository = problemRepository ?? throw new ArgumentNullException(nameof(problemRepository));
            _submissionRepository = submissionRepository ?? throw new ArgumentNullException(nameof(submissionRepository));
            _mapper = mapper;
        }

        #region Helper Classes

        public class Parameter
        {
            public string Name { get; set; } = "";
            public string Type { get; set; } = "";
        }

        #endregion

        #region Private Helper Methods

        private static string ToBase64(string input)
        {
            if (string.IsNullOrEmpty(input))
                return string.Empty;

            return Convert.ToBase64String(Encoding.UTF8.GetBytes(input));
        }

        private static string FromBase64(string base64)
        {
            if (string.IsNullOrEmpty(base64))
                return string.Empty;

            try
            {
                return Encoding.UTF8.GetString(Convert.FromBase64String(base64));
            }
            catch
            {
                return base64;
            }
        }

        private static List<Parameter> ParseParameters(string? parametersStr)
        {
            var parameters = new List<Parameter>();

            if (string.IsNullOrWhiteSpace(parametersStr))
                return parameters;

            var parts = parametersStr.Split(',', StringSplitOptions.TrimEntries);

            foreach (var part in parts)
            {
                var match = NameColonTypePattern.Match(part);
                if (match.Success)
                {
                    parameters.Add(new Parameter
                    {
                        Name = match.Groups[1].Value,
                        Type = match.Groups[2].Value
                    });
                    continue;
                }

                match = TypeSpaceNamePattern.Match(part);
                if (match.Success)
                {
                    parameters.Add(new Parameter
                    {
                        Type = match.Groups[1].Value,
                        Name = match.Groups[2].Value
                    });
                }
            }

            return parameters;
        }

        private static List<string> ParseInputValues(string input)
        {
            var values = new List<string>();

            if (string.IsNullOrWhiteSpace(input))
                return values;

            input = input.Trim();
            int depth = 0, start = 0;
            bool inString = false;

            for (int i = 0; i < input.Length; i++)
            {
                char c = input[i];

                if (c == '"' && (i == 0 || input[i - 1] != '\\'))
                {
                    inString = !inString;
                }
                else if (!inString)
                {
                    switch (c)
                    {
                        case '[':
                        case '{':
                            depth++;
                            break;
                        case ']':
                        case '}':
                            depth--;
                            break;
                        case ',' when depth == 0:
                            values.Add(input[start..i].Trim());
                            start = i + 1;
                            break;
                    }
                }
            }

            if (start < input.Length)
            {
                values.Add(input[start..].Trim());
            }

            return values;
        }

        private static string ConvertToJson(string value, string type)
        {
            value = value.Trim();
            type = type.ToLower();

            if ((type is "string" or "str") && value.StartsWith('"') && value.EndsWith('"'))
            {
                value = value[1..^1];
            }

            if (type.EndsWith("[]"))
            {
                return value.StartsWith('[') ? value : $"[{value}]";
            }

            if (type is "string" or "str")
            {
                return value.StartsWith('"') ? value : JsonSerializer.Serialize(value);
            }

            if (type is "int" or "float" or "double" or "number" or "long" or "bool" or "boolean")
            {
                return type is "bool" or "boolean" ? value.ToLower() : value;
            }

            return value;
        }

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
                Message = errorMessage,
                Passed = false
            };
        }

        private static int GetLanguageId(string language)
        {
            return language.ToLower() switch
            {
                "python" or "python3" or "py" => 71,
                "cpp" or "c++" => 54,
                "javascript" or "js" or "node" => 63,
                "java" => 62,
                "c" => 50,
                "csharp" or "c#" or "cs" => 51,
                "go" or "golang" => 60,
                "rust" => 73,
                "ruby" or "rb" => 72,
                "php" => 68,
                "typescript" or "ts" => 74,
                "kotlin" or "kt" => 78,
                "swift" => 83,
                _ => throw new ArgumentException($"Unsupported language: {language}")
            };
        }

        #endregion

        #region Public Methods


        // run test .
        public async Task<List<Judge0Response>> RunAllTestCasesAsync(
            string language,
            string userCode,
            string functionName,
            List<Guid> testCaseIds,
            Guid problemId)
        {
            var results = new List<Judge0Response>();

            try
            {
                var problem = await _problemRepository.GetByIdAsync(problemId);
                if (problem == null)
                {
                    results.Add(CreateErrorResponse($"Problem not found: {problemId}"));
                    return results;
                }

                var parameters = ParseParameters(problem.Parameters);

                Console.WriteLine($"\n[DEBUG] ===== PROBLEM INFO =====");
                Console.WriteLine($"Title: {problem.Title}");
                Console.WriteLine($"Function: {functionName}");
                Console.WriteLine($"Parameters: {problem.Parameters}");
                Console.WriteLine($"Parsed {parameters.Count} parameter(s):");
                foreach (var param in parameters)
                {
                    Console.WriteLine($"  - {param.Name}: {param.Type}");
                }

                foreach (Guid id in testCaseIds)
                {
                    try
                    {
                        var testCase = await _testCaseRepository.GetByIdAsync(id);

                        if (testCase == null)
                        {
                            results.Add(CreateErrorResponse($"TestCase not found: {id}"));
                            continue;
                        }

                        if (string.IsNullOrWhiteSpace(testCase.Input))
                        {
                            results.Add(CreateErrorResponse("Empty input"));
                            continue;
                        }

                        Console.WriteLine($"\n[DEBUG] ===== TEST CASE {id} =====");
                        Console.WriteLine($"Raw Input: {testCase.Input}");
                        Console.WriteLine($"Expected Output: {testCase.ExpectedOutput}");

                        var inputValues = ParseInputValues(testCase.Input);

                        Console.WriteLine($"Parsed {inputValues.Count} value(s):");
                        for (int i = 0; i < inputValues.Count; i++)
                        {
                            Console.WriteLine($"  [{i}] = {inputValues[i]}");
                        }

                        string jsonInput = BuildJsonInput(inputValues, parameters);
                        Console.WriteLine($"Final JSON Input: {jsonInput}");

                        string fullCode;
                        try
                        {
                            fullCode = BuildFullCode(language, userCode, functionName, jsonInput, parameters);
                            Console.WriteLine($"\n[DEBUG] Generated Code:\n{fullCode}\n");
                        }
                        catch (Exception ex)
                        {
                            results.Add(CreateErrorResponse($"Code generation error: {ex.Message}"));
                            continue;
                        }

                        var response = await SubmitAsync(language, fullCode, id, testCase.ExpectedOutput, problem.TimeLimit, problem.MemoryLimit);
                        results.Add(response);
                    }
                    catch (Exception ex)
                    {
                        results.Add(CreateErrorResponse($"Error processing test case {id}: {ex.Message}"));
                    }
                }
            }
            catch (Exception ex)
            {
                results.Add(CreateErrorResponse($"Fatal error: {ex.Message}"));
            }

            return results;
        }


        // submit problem .
        public async Task<Object> SubmitProblem(Guid userId, Guid problemId, string language, string userCode, string functionName)
        {
            try
            {
                var problem = await _problemRepository.GetByIdAsync(problemId);
                if (problem == null)
                {
                    return new
                    {
                        testCasePass = 0,
                        totalTestCase = 0,
                        submit = false,
                        status = "Error",
                        message = $"Problem not found: {problemId}"
                    };
                }

                var parameters = ParseParameters(problem.Parameters);
                List<TestCase> testCases = await _testCaseRepository.GetAllByProblemIdAsync(null, problemId);


                if (testCases == null || testCases.Count == 0)
                {
                    return new
                    {
                        testCasePass = 0,
                        totalTestCase = 0,
                        submit = false,
                        status = "Error",
                        message = "No test cases found"
                    };
                }

                int countTestCasePassed = 0;
                string status = "Accepted", message = "";
                Judge0Response resultFail = null;
                double time = 0;
                int memory = 0;
                bool checkPass = true;

                foreach (var testCase in testCases)
                {
                    try
                    {
                        var inputValues = ParseInputValues(testCase.Input);
                        string jsonInput = BuildJsonInput(inputValues, parameters);
                        string fullCode = BuildFullCode(language, userCode, functionName, jsonInput, parameters);
                        var response = await SubmitAsync(language, fullCode, testCase.TestCaseId, testCase.ExpectedOutput, problem.TimeLimit, problem.MemoryLimit);

                        time = Math.Max(time, Double.Parse(response.Time));
                        memory = Math.Max(memory, response.Memory ?? 0);
                        if (response.Passed == true)
                        {
                            countTestCasePassed++;
                        }
                        else
                        {
                            status = response.Status?.Description ?? "Failed";
                            message = response.Message ?? response.Stderr ?? "Test case failed";
                            resultFail = response;
                            checkPass = false;
                            break;
                        }
                    }
                    catch (Exception ex)
                    {
                        status = "Runtime Error";
                        message = $"Error processing test case: {ex.Message}";
                        break;
                    }
                }

                if (problem.Status != "SOLVED") problem.Status = checkPass ? "SOLVED" : "ATTEMPTED";
                UpdateProblemDto updateProblemDto = _mapper.Map<UpdateProblemDto>(problem);
                await _problemRepository.UpdateAsync(updateProblemDto);

                CreateSubmissionDto createSubmissionDto = new CreateSubmissionDto(userId, problemId, userCode, language, status, (int)(time * 1000), memory, countTestCasePassed, testCases.Count);
                await _submissionRepository.CreateAsync(createSubmissionDto);

                return new
                {
                    testCasePass = countTestCasePassed,
                    totalTestCase = testCases.Count,
                    submit = countTestCasePassed == testCases.Count,
                    status,
                    message,
                    time,
                    memory,
                    resultFail,
                };
            }
            catch (Exception ex)
            {
                return new
                {
                    testCasePass = 0,
                    totalTestCase = 0,
                    submit = false,
                    status = "Error",
                    message = $"Fatal error: {ex.Message}"
                };
            }
        }

        private static string BuildJsonInput(List<string> inputValues, List<Parameter> parameters)
        {
            if (inputValues.Count == 0)
                return "[]";

            var firstValue = inputValues[0].Trim();
            bool isJsonObject = firstValue.StartsWith('{') && firstValue.EndsWith('}');
            bool isJsonArray = firstValue.StartsWith('[') && firstValue.EndsWith(']');

            if (isJsonObject || isJsonArray)
            {
                Console.WriteLine($"  Input is already valid JSON: {firstValue}");
                return firstValue;
            }

            if (parameters.Count == 0)
            {
                return inputValues.Count == 1 ? inputValues[0] : $"[{string.Join(",", inputValues)}]";
            }

            if (parameters.Count == 1)
            {
                return ConvertToJson(inputValues[0], parameters[0].Type);
            }

            var jsonValues = new List<string>();
            for (int i = 0; i < Math.Min(parameters.Count, inputValues.Count); i++)
            {
                var converted = ConvertToJson(inputValues[i], parameters[i].Type);
                jsonValues.Add(converted);
                Console.WriteLine($"  Convert: {inputValues[i]} ({parameters[i].Type}) → {converted}");
            }

            return $"[{string.Join(",", jsonValues)}]";
        }

        public static string BuildFullCode(string language, string userCode, string functionName, string inputJson, List<Parameter> parameters = null)
        {
            if (string.IsNullOrWhiteSpace(userCode))
                throw new ArgumentException("User code cannot be empty");

            if (string.IsNullOrWhiteSpace(functionName))
                throw new ArgumentException("Function name cannot be empty");

            return language.ToLower() switch
            {
                "python" or "python3" or "py" => BuildPythonCode(userCode, functionName, inputJson),
                "cpp" or "c++" => BuildCppCode(userCode, functionName, inputJson, parameters),
                "javascript" or "js" or "node" => BuildJavaScriptCode(userCode, functionName, inputJson),
                "java" => BuildJavaCode(userCode, functionName, inputJson, parameters),
                _ => throw new ArgumentException($"Unsupported language: {language}")
            };
        }

        public async Task<Judge0Response> SubmitAsync(string language, string fullCode, Guid testCaseId, string expectedOutput, int timeLimit, int memory)
        {
            try
            {
                int languageId = GetLanguageId(language);

                var payload = new
                {
                    source_code = ToBase64(fullCode),
                    language_id = languageId,
                    stdin = ToBase64(""),
                    expected_output = ToBase64(expectedOutput ?? ""),
                    cpu_time_limit = Math.Max(0.1, (double)timeLimit / 1000),
                    memory_limit = Math.Max(128, memory) * 1000,
                    wall_time_limit = 5.0,
                    max_file_size = 1024
                };

                var content = new StringContent(
                    JsonSerializer.Serialize(payload),
                    Encoding.UTF8,
                    "application/json"
                );

                var urlWithParams = $"{BaseUrl}?base64_encoded=true&wait=true";

                using var request = new HttpRequestMessage(HttpMethod.Post, urlWithParams);
                request.Headers.Add("x-rapidapi-host", RapidApiHost);
                request.Headers.Add("x-rapidapi-key", RapidApiKey);
                request.Content = content;

                var response = await _httpClient.SendAsync(request);
                var responseBody = await response.Content.ReadAsStringAsync();

                Console.WriteLine($"[DEBUG] Judge0 Response Status: {response.StatusCode}");

                if (!response.IsSuccessStatusCode)
                {
                    return CreateErrorResponse($"Judge0 API Error [{response.StatusCode}]: {responseBody}");
                }

                var result = JsonSerializer.Deserialize<Judge0Response>(
                    responseBody,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true,
                        AllowTrailingCommas = true,
                        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
                    });

                if (result != null)
                {
                    result.Stdout = FromBase64OrNull(result.Stdout);
                    result.Stderr = FromBase64OrNull(result.Stderr);
                    result.CompileOutput = FromBase64OrNull(result.CompileOutput);
                    result.Message = FromBase64OrNull(result.Message);
                    result.ExpectedOutput = expectedOutput;
                    result.TestCaseId = testCaseId;

                    // Kiểm tra status trước
                    if (result.Status?.Id == 3) // Accepted
                    {
                        if (!string.IsNullOrEmpty(result.ExpectedOutput) && !string.IsNullOrEmpty(result.Stdout))
                        {
                            result.Passed = result.Stdout.Trim() == result.ExpectedOutput.Trim();
                        }
                        else
                        {
                            result.Passed = string.IsNullOrEmpty(result.ExpectedOutput) && string.IsNullOrEmpty(result.Stdout);
                        }
                    }
                    else
                    {
                        result.Passed = false;
                    }

                    Console.WriteLine($"[DEBUG] Status: {result.Status?.Id} - {result.Status?.Description}");
                    Console.WriteLine($"[DEBUG] Stdout: {result.Stdout ?? "null"}");
                    Console.WriteLine($"[DEBUG] Expected: {result.ExpectedOutput ?? "null"}");
                    Console.WriteLine($"[DEBUG] Passed: {result.Passed}");

                    if (!string.IsNullOrEmpty(result.Stderr))
                    {
                        Console.WriteLine($"[DEBUG] Stderr:\n{result.Stderr}");
                    }

                    if (!string.IsNullOrEmpty(result.CompileOutput))
                    {
                        Console.WriteLine($"[DEBUG] Compile Output:\n{result.CompileOutput}");
                    }
                }

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
            catch (Exception ex)
            {
                return CreateErrorResponse($"Unexpected error: {ex.Message}");
            }
        }

        private static string? FromBase64OrNull(string? base64) =>
            !string.IsNullOrEmpty(base64) ? FromBase64(base64) : null;

        #endregion

        #region Language-Specific Code Builders

        private static string BuildPythonCode(string userCode, string functionName, string inputJson)
        {
            var escapedJson = JsonSerializer.Serialize(inputJson);

            return $@"import json
import sys

{userCode}

if __name__ == '__main__':
    try:
        data = json.loads({escapedJson})
        
        if isinstance(data, dict):
            result = {functionName}(**data)
        elif isinstance(data, list):
            result = {functionName}(*data)
        else:
            result = {functionName}(data)
        
        print(json.dumps(result, ensure_ascii=False))
    except Exception as e:
        print(f'ERROR: {{str(e)}}', file=sys.stderr)
        sys.exit(1)
";
        }

        private static string BuildCppCode(string userCode, string functionName, string inputJson, List<Parameter>? parameters)
        {
            using var doc = JsonDocument.Parse(inputJson);
            var root = doc.RootElement;

            var cppParams = new List<string>();
            var declarations = new List<string>();
            var paramTypes = parameters ?? new List<Parameter>();

            if (root.ValueKind == JsonValueKind.Object)
            {
                int argIdx = 0;
                foreach (var param in paramTypes)
                {
                    if (root.TryGetProperty(param.Name, out var element))
                    {
                        var (decl, paramName) = ConvertJsonToCppWithDeclaration(element, param.Type.ToLower(), argIdx);
                        if (!string.IsNullOrEmpty(decl))
                            declarations.Add(decl);
                        cppParams.Add(paramName);
                        argIdx++;
                    }
                }
            }
            else if (root.ValueKind == JsonValueKind.Array)
            {
                int idx = 0;
                foreach (var element in root.EnumerateArray())
                {
                    var paramType = idx < paramTypes.Count ? paramTypes[idx].Type.ToLower() : "auto";
                    var (decl, paramName) = ConvertJsonToCppWithDeclaration(element, paramType, idx);
                    if (!string.IsNullOrEmpty(decl))
                        declarations.Add(decl);
                    cppParams.Add(paramName);
                    idx++;
                }
            }
            else
            {
                var paramType = paramTypes.Count > 0 ? paramTypes[0].Type.ToLower() : "auto";
                var (decl, paramName) = ConvertJsonToCppWithDeclaration(root, paramType, 0);
                if (!string.IsNullOrEmpty(decl))
                    declarations.Add(decl);
                cppParams.Add(paramName);
            }

            var declarationsCode = declarations.Count > 0
                ? "        " + string.Join("\n        ", declarations) + "\n        "
                : "";

            var callCode = $"{declarationsCode}auto result = {functionName}({string.Join(", ", cppParams)});";

            return $@"#include <bits/stdc++.h>
using namespace std;

{userCode}

template<typename T>
string toString(const T& val) {{
    ostringstream oss;
    oss << val;
    return oss.str();
}}

string toString(bool val) {{
    return val ? ""true"" : ""false"";
}}

template<typename T>
string toString(const vector<T>& vec) {{
    ostringstream oss;
    oss << ""["";
    for (size_t i = 0; i < vec.size(); i++) {{
        if (i > 0) oss << "","";
        oss << toString(vec[i]);
    }}
    oss << ""]"";
    return oss.str();
}}

string toString(const string& s) {{
    return ""\"""" + s + ""\"""";
}}

string toString(const vector<string>& vec) {{
    ostringstream oss;
    oss << ""["";
    for (size_t i = 0; i < vec.size(); i++) {{
        if (i > 0) oss << "","";
        oss << ""\"""" << vec[i] << ""\"""";
    }}
    oss << ""]"";
    return oss.str();
}}

int main() {{
    try {{
{callCode}
        cout << toString(result) << endl;
        return 0;
    }} catch (exception& e) {{
        cerr << ""ERROR: "" << e.what() << endl;
        return 1;
    }}
}}
";
        }

        private static (string declaration, string paramName) ConvertJsonToCppWithDeclaration(
            JsonElement element,
            string expectedType,
            int argIndex)
        {
            // Nếu là vector/array, tạo biến tạm
            if (expectedType.EndsWith("[]") || expectedType.Contains("vector"))
            {
                if (element.ValueKind == JsonValueKind.Array)
                {
                    var baseType = expectedType
                        .Replace("[]", "")
                        .Replace("vector<", "")
                        .Replace(">", "")
                        .Trim();

                    var cppType = baseType switch
                    {
                        "int" or "integer" => "int",
                        "long" => "long long",
                        "double" or "float" => "double",
                        "string" or "str" => "string",
                        "bool" or "boolean" => "bool",
                        "char" => "char",
                        _ => "int"
                    };

                    var items = element.EnumerateArray()
                        .Select(e => ConvertJsonToCpp(e, baseType))
                        .ToList();

                    var varName = $"arg{argIndex}";
                    var init = $"{{{string.Join(", ", items)}}}";
                    var declaration = $"vector<{cppType}> {varName} = {init};";

                    return (declaration, varName);
                }
            }

            // Nếu không phải vector, trả về trực tiếp
            return (string.Empty, ConvertJsonToCpp(element, expectedType));
        }

        private static string ConvertJsonToCpp(JsonElement element, string expectedType = "auto")
        {
            if (expectedType.EndsWith("[]") || expectedType.Contains("vector"))
            {
                if (element.ValueKind == JsonValueKind.Array)
                {
                    var baseType = expectedType.Replace("[]", "").Replace("vector<", "").Replace(">", "").Trim();
                    var items = element.EnumerateArray()
                        .Select(e => ConvertJsonToCpp(e, baseType))
                        .ToList();
                    return $"{{{string.Join(", ", items)}}}";
                }
            }

            return element.ValueKind switch
            {
                JsonValueKind.String => $"\"{element.GetString()?.Replace("\\", "\\\\").Replace("\"", "\\\"")}\"",
                JsonValueKind.Number => element.ToString(),
                JsonValueKind.True => "true",
                JsonValueKind.False => "false",
                JsonValueKind.Array => $"{{{string.Join(", ", element.EnumerateArray().Select(e => ConvertJsonToCpp(e)))}}}",
                _ => "0"
            };
        }

        private static string BuildJavaScriptCode(string userCode, string functionName, string inputJson)
        {
            var escapedJson = JsonSerializer.Serialize(inputJson);

            return $@"{userCode}

(async function() {{
    try {{
        const data = JSON.parse({escapedJson});
        let result;
        
        if (Array.isArray(data)) {{
            result = {functionName}(...data);
        }} else if (typeof data === 'object' && data !== null) {{
            const values = Object.values(data);
            result = {functionName}(...values);
        }} else {{
            result = {functionName}(data);
        }}
        
        if (result instanceof Promise) {{
            result = await result;
        }}
        
        if (typeof result === 'string') {{
            console.log(JSON.stringify(result));
        }} else if (Array.isArray(result) || (typeof result === 'object' && result !== null)) {{
            console.log(JSON.stringify(result));
        }} else {{
            console.log(result);
        }}
    }} catch (e) {{
        console.error('ERROR:', e.message);
        process.exit(1);
    }}
}})();
";
        }

        private static string BuildJavaCode(string userCode, string functionName, string inputJson, List<Parameter>? parameters)
        {
            using var doc = JsonDocument.Parse(inputJson);
            var root = doc.RootElement;

            var javaParams = new List<string>();
            var paramTypes = parameters ?? new List<Parameter>();

            if (root.ValueKind == JsonValueKind.Object)
            {
                foreach (var param in paramTypes)
                {
                    if (root.TryGetProperty(param.Name, out var element))
                    {
                        javaParams.Add(ConvertJsonToJava(element, param.Type.ToLower()));
                    }
                }
            }
            else if (root.ValueKind == JsonValueKind.Array)
            {
                int idx = 0;
                foreach (var element in root.EnumerateArray())
                {
                    var paramType = idx < paramTypes.Count ? paramTypes[idx].Type.ToLower() : "";
                    javaParams.Add(ConvertJsonToJava(element, paramType));
                    idx++;
                }
            }
            else
            {
                var paramType = paramTypes.Count > 0 ? paramTypes[0].Type.ToLower() : "";
                javaParams.Add(ConvertJsonToJava(root, paramType));
            }

            var cleanedUserCode = PublicClassPattern.Replace(userCode, "class ");

            var callCode = $@"Solution solution = new Solution();
            Object result = solution.{functionName}({string.Join(", ", javaParams)});";

            return $@"import java.util.*;

{cleanedUserCode}

public class Main {{
    public static void main(String[] args) {{
        try {{
            {callCode}
            
            if (result instanceof int[]) {{
                printIntArray((int[]) result);
            }} else if (result instanceof long[]) {{
                printLongArray((long[]) result);
            }} else if (result instanceof double[]) {{
                printDoubleArray((double[]) result);
            }} else if (result instanceof boolean[]) {{
                printBooleanArray((boolean[]) result);
            }} else if (result instanceof String[]) {{
                printStringArray((String[]) result);
            }} else if (result instanceof String) {{
                System.out.println(""\"""" + result + ""\"""");
            }} else if (result instanceof Boolean) {{
                System.out.println(result.toString().toLowerCase());
            }} else {{
                System.out.println(result);
            }}
        }} catch (Exception e) {{
            System.err.println(""ERROR: "" + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }}
    }}
    
    private static void printIntArray(int[] arr) {{
        System.out.print(""["");
        for (int i = 0; i < arr.length; i++) {{
            if (i > 0) System.out.print("","");
            System.out.print(arr[i]);
        }}
        System.out.println(""]"");
    }}
    
    private static void printLongArray(long[] arr) {{
        System.out.print(""["");
        for (int i = 0; i < arr.length; i++) {{
            if (i > 0) System.out.print("","");
            System.out.print(arr[i]);
        }}
        System.out.println(""]"");
    }}
    
    private static void printDoubleArray(double[] arr) {{
        System.out.print(""["");
        for (int i = 0; i < arr.length; i++) {{
            if (i > 0) System.out.print("","");
            System.out.print(arr[i]);
        }}
        System.out.println(""]"");
    }}
    
    private static void printBooleanArray(boolean[] arr) {{
        System.out.print(""["");
        for (int i = 0; i < arr.length; i++) {{
            if (i > 0) System.out.print("","");
            System.out.print(arr[i] ? ""true"" : ""false"");
        }}
        System.out.println(""]"");
    }}
    
    private static void printStringArray(String[] arr) {{
        System.out.print(""["");
        for (int i = 0; i < arr.length; i++) {{
            if (i > 0) System.out.print("","");
            System.out.print(""\"""" + arr[i] + ""\"""");
        }}
        System.out.println(""]"");
    }}
}}
";
        }

        private static string ConvertJsonToJava(JsonElement element, string expectedType = "")
        {
            if (expectedType.EndsWith("[]") && element.ValueKind == JsonValueKind.Array)
            {
                var baseType = expectedType.Replace("[]", "").Trim();
                var items = element.EnumerateArray()
                    .Select(e => ConvertJsonToJava(e, baseType))
                    .ToList();

                var typeName = baseType switch
                {
                    "int" or "integer" => "int",
                    "long" => "long",
                    "double" or "float" => "double",
                    "boolean" or "bool" => "boolean",
                    "string" or "str" => "String",
                    "char" or "character" => "char",
                    _ => "int"
                };

                return $"new {typeName}[]{{{string.Join(", ", items)}}}";
            }

            return element.ValueKind switch
            {
                JsonValueKind.String => $"\"{element.GetString()?.Replace("\\", "\\\\").Replace("\"", "\\\"")}\"",
                JsonValueKind.Number => element.TryGetInt32(out var i) ? i.ToString() :
                                       (element.TryGetInt64(out var l) ? $"{l}L" : element.ToString()),
                JsonValueKind.True => "true",
                JsonValueKind.False => "false",
                JsonValueKind.Array => ConvertArrayToJava(element),
                _ => "null"
            };
        }

        private static string ConvertArrayToJava(JsonElement arrayElement)
        {
            var items = arrayElement.EnumerateArray().Select(e => ConvertJsonToJava(e, "")).ToList();

            if (items.Count == 0)
                return "new int[]{}";

            var firstItem = arrayElement.EnumerateArray().First();
            var typeName = firstItem.ValueKind switch
            {
                JsonValueKind.String => "String",
                JsonValueKind.Number => firstItem.TryGetInt32(out _) ? "int" :
                                       (firstItem.TryGetInt64(out _) ? "long" : "double"),
                JsonValueKind.True or JsonValueKind.False => "boolean",
                _ => "int"
            };

            return $"new {typeName}[]{{{string.Join(", ", items)}}}";
        }

        #endregion
    }
}