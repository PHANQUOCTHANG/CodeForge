import { useMemo, useState } from "react";
import {
  TrendingUp,
  Clock,
  Users,
  BookOpen,
  Code,
  CheckCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import "./Dashboard.scss";

interface StatCard {
  label: string;
  value: string;
  trend: string;
  color: string;
  icon: React.ReactNode;
}

interface Submission {
  id: number;
  student: string;
  exercise: string;
  course: string;
  status: "passed" | "failed" | "pending";
  score: number | null;
  time: string;
}

interface Course {
  name: string;
  students: number;
  completion: number;
}

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 5;

  const stats: StatCard[] = useMemo(
    () => [
      {
        label: "Tổng học viên",
        value: "1,284",
        trend: "+12%",
        color: "#3b82f6",
        icon: <Users size={20} />,
      },
      {
        label: "Khóa học",
        value: "24",
        trend: "+3",
        color: "#10b981",
        icon: <BookOpen size={20} />,
      },
      {
        label: "Bài tập",
        value: "156",
        trend: "+8",
        color: "#8b5cf6",
        icon: <Code size={20} />,
      },
      {
        label: "Bài nộp hôm nay",
        value: "89",
        trend: "+24%",
        color: "#f59e0b",
        icon: <CheckCircle size={20} />,
      },
    ],
    []
  );

  const submissions: Submission[] = [
    { id: 1, student: "Nguyễn Văn A", exercise: "Thuật toán sắp xếp", course: "JavaScript Cơ bản", status: "passed", score: 95, time: "5 phút trước" },
    { id: 2, student: "Trần Thị B", exercise: "Promise và Async/Await", course: "JavaScript Nâng cao", status: "failed", score: 45, time: "12 phút trước" },
    { id: 3, student: "Lê Văn C", exercise: "Component trong React", course: "React cơ bản", status: "passed", score: 88, time: "18 phút trước" },
    { id: 4, student: "Phạm Thị D", exercise: "State Management", course: "React nâng cao", status: "pending", score: null, time: "25 phút trước" },
    { id: 5, student: "Hoàng Văn E", exercise: "API Integration", course: "JavaScript Nâng cao", status: "passed", score: 92, time: "32 phút trước" },
    { id: 6, student: "Đỗ Văn F", exercise: "Redux Toolkit", course: "React nâng cao", status: "passed", score: 90, time: "45 phút trước" },
    { id: 7, student: "Vũ Thị G", exercise: "Database Design", course: "SQL Fundamentals", status: "failed", score: 55, time: "1 giờ trước" },
    { id: 8, student: "Bùi Văn H", exercise: "Authentication", course: "Node.js Backend", status: "passed", score: 87, time: "1 giờ trước" },
    { id: 9, student: "Đinh Thị I", exercise: "CSS Grid Layout", course: "Web Design", status: "passed", score: 93, time: "2 giờ trước" },
    { id: 10, student: "Mai Văn K", exercise: "TypeScript Basics", course: "TypeScript Advanced", status: "pending", score: null, time: "2 giờ trước" },
  ];

  const startIndex = (currentPage - 1) * submissionsPerPage;
  const currentSubmissions = submissions.slice(
    startIndex,
    startIndex + submissionsPerPage
  );
  const totalPages = Math.ceil(submissions.length / submissionsPerPage);

  const topCourses: Course[] = [
    { name: "JavaScript Cơ bản", students: 342, completion: 78 },
    { name: "React Fundamentals", students: 289, completion: 65 },
    { name: "Python cho người mới", students: 256, completion: 82 },
    { name: "Node.js Backend", students: 198, completion: 71 },
  ];

  const submissionStatusData = [
    { name: "Đạt", value: 456, color: "#10b981" },
    { name: "Không đạt", value: 123, color: "#ef4444" },
    { name: "Chờ chấm", value: 89, color: "#f59e0b" },
  ];

  const coursesDistributionData = [
    { name: "JavaScript Cơ bản", value: 342, color: "#3b82f6" },
    { name: "React Fundamentals", value: 289, color: "#8b5cf6" },
    { name: "Python cho người mới", value: 256, color: "#10b981" },
    { name: "Node.js Backend", value: 198, color: "#f59e0b" },
    { name: "TypeScript Advanced", value: 156, color: "#ec4899" },
  ];

  const renderStatus = (status: Submission["status"]) => {
    switch (status) {
      case "passed":
        return <span className="badge passed">Đạt</span>;
      case "failed":
        return <span className="badge failed">Không đạt</span>;
      case "pending":
        return <span className="badge pending">Chờ chấm</span>;
    }
  };

  return (
    <div className="dashboard">
      {/* Stats */}
      <div className="statsGrid">
        {stats.map((stat, idx) => (
          <div key={idx} className="statCard">
            <div
              className="icon"
              style={{
                backgroundColor: `${stat.color}20`,
                color: stat.color,
              }}
            >
              {stat.icon}
            </div>
            <div className="info">
              <p className="label">{stat.label}</p>
              <p className="value">{stat.value}</p>
              <div className="trend">
                <TrendingUp size={14} /> <span>{stat.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="gridCharts">
        <div className="card">
          <h3>Phân bố trạng thái bài nộp</h3>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={submissionStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) =>
                    `${props.name} ${(props.percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  dataKey="value"
                >
                  {submissionStatusData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3>Phân bố học viên theo khóa học</h3>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={coursesDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) =>
                    `${(props.percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  dataKey="value"
                >
                  {coursesDistributionData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Submissions + Top Courses */}
      <div className="gridBottom">
        <div className="card submissions">
          <div className="header">
            <h4>Bài nộp gần đây</h4>
            <button>Xem tất cả</button>
          </div>
          <div className="tableWrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Học viên</th>
                  <th>Bài tập</th>
                  <th>Trạng thái</th>
                  <th>Điểm</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {currentSubmissions.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div>
                        <p className="name">{s.student}</p>
                        <p className="course">{s.course}</p>
                      </div>
                    </td>
                    <td>{s.exercise}</td>
                    <td>{renderStatus(s.status)}</td>
                    <td>{s.score !== null ? `${s.score}/100` : "-"}</td>
                    <td>
                      <div className="time">
                        <Clock size={14} /> {s.time}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={currentPage === i + 1 ? "active" : ""}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                →
              </button>
            </div>
          )}
        </div>

        <div className="card topCourses">
          <h4>Khóa học phổ biến</h4>
          <div className="list">
            {topCourses.map((c, idx) => (
              <div key={idx} className="item">
                <div className="row">
                  <p>{c.name}</p>
                  <span>{c.students}</span>
                </div>
                <div className="progressBar">
                  <div
                    className="progress"
                    style={{ width: `${c.completion}%` }}
                  ></div>
                </div>
                <p className="percent">{c.completion}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
