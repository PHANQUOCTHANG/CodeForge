public class ApiResponse<T>
{
    public int Code { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }

    public ApiResponse(int code, string message, T? data = default)
    {
        Code = code;
        Message = message;
        Data = data;
    }
}
