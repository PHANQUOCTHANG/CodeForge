using System;
using System.Collections.Generic;

namespace CodeForge.Api.DTOs.Statistics
{
    public class DashboardStatsDto
    {
        public DashboardSummaryDto Summary { get; set; } = new();
        public List<RevenueChartDto> RevenueChart { get; set; } = new();
        public List<NewUserChartDto> NewUserChart { get; set; } = new();
        public List<TopCourseDto> TopCourses { get; set; } = new();
        public SubmissionStatsDto SubmissionStats { get; set; } = new();
    }

    public class DashboardSummaryDto
    {
        public int TotalStudents { get; set; }
        public int TotalCourses { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalSubmissions { get; set; }
    }

    public class RevenueChartDto
    {
        public string Date { get; set; } = string.Empty; // "MM/yyyy" hoặc "dd/MM"
        public decimal Amount { get; set; }
    }

    public class NewUserChartDto
    {
        public string Date { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class TopCourseDto
    {
        public Guid CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Thumbnail { get; set; } = string.Empty;
        public int TotalStudents { get; set; }
        public decimal Revenue { get; set; }
    }

    public class SubmissionStatsDto
    {
        public int Total { get; set; }
        public int Solved { get; set; } // Status = "Accepted" hoặc "SOLVED"
        public int Failed { get; set; } // Các status khác
        public double PassRate { get; set; } // %
    }
}