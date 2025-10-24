// Core/Models/PaginationResult.cs
namespace CodeForge.Core.Models
{
    public class PaginationResult<T>
    {
        public IEnumerable<T> Data { get; set; }
        public int TotalItems { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling(TotalItems / (double)PageSize);

        public PaginationResult(IEnumerable<T> data, int totalItems, int page, int pageSize)
        {
            Data = data;
            TotalItems = totalItems;
            Page = page;
            PageSize = pageSize;
        }
    }
}
