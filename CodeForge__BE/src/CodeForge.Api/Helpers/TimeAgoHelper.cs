namespace CodeForge.Api.Helpers
{
    public static class TimeAgoHelper
    {
        /// <summary>
        /// Tính thời gian từ lúc tạo đến hiện tại
        /// Format: "Vừa xong", "5 phút trước", "2 giờ trước", "3 ngày trước"
        /// </summary>
        public static string GetTimeAgo(DateTime createdAt)
        {
            var timeSpan = DateTime.UtcNow - createdAt;

            // Vừa xong (< 1 phút)
            if (timeSpan.TotalMinutes < 1)
            {
                return "Just now";
            }

            // X minutes ago (< 60 minutes)
            if (timeSpan.TotalMinutes < 60)
            {
                var minutes = (int)timeSpan.TotalMinutes;
                return $"{minutes} minutes ago";
            }

            // X hours ago (< 24 hours)
            if (timeSpan.TotalHours < 24)
            {
                var hours = (int)timeSpan.TotalHours;
                return $"{hours} hours ago";
            }

            // X days ago (< 7 days)
            if (timeSpan.TotalDays < 7)
            {
                var days = (int)timeSpan.TotalDays;
                return days == 1 ? "1 day ago" : $"{days} days ago";
            }

            // X weeks ago (< 30 days)
            if (timeSpan.TotalDays < 30)
            {
                var weeks = (int)(timeSpan.TotalDays / 7);
                return weeks == 1 ? "1 week ago" : $"{weeks} weeks ago";
            }

            // X months ago (< 365 days)
            if (timeSpan.TotalDays < 365)
            {
                var months = (int)(timeSpan.TotalDays / 30);
                return months == 1 ? "1 month ago" : $"{months} months ago";
            }

            // X years ago
            var years = (int)(timeSpan.TotalDays / 365);
            return years == 1 ? "1 year ago" : $"{years} years ago";
        }

        /// <summary>
        /// Format ngày giờ dạng: "15/11/2024 14:30"
        /// </summary>
        public static string GetFormattedDateTime(DateTime dateTime)
        {
            return dateTime.ToString("dd/MM/yyyy HH:mm");
        }

        /// <summary>
        /// Format ngày giờ dạng: "15 Nov 2024"
        /// </summary>
        public static string GetShortDate(DateTime dateTime)
        {
            return dateTime.ToString("dd MMM yyyy");
        }
    }
}