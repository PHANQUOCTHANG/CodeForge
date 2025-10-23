namespace CodeForge.Api.DTOs.Response
{
    public class Judge0Response
    {
        public string Stdout { get; set; }
        public string Stderr { get; set; }
        public string CompileOutput { get; set; }
        public string Message { get; set; }
        public string Time { get; set; }  // ✅ đổi từ double? sang string
        public int? Memory { get; set; }
        public Judge0Status Status { get; set; }
    }
    public class Judge0Status
    {
        public int Id { get; set; }
        public string Description { get; set; }
    }
}