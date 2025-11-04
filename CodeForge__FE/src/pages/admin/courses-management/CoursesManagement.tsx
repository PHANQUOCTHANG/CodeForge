import { useState, useEffect, useRef } from "react"; // <-- THÊM useRef
import {
  FaPlus,
  FaUserGraduate,
  FaClipboardList,
  FaStar,
  FaEllipsisH,
  FaChartLine,
  FaBook,
  FaEye,
} from "react-icons/fa";
import "./Courses.scss";

// ... (Interface Course và mockCourses giữ nguyên) ...
interface Course {
  id: number;
  title: string;
  description: string;
  students: number;
  exercises: number;
  rating: number;
  progress: number;
  status: "Đã xuất bản" | "Bản nháp";
  color: string;
  instructor: string;
}

const mockCourses: Course[] = [
  {
    id: 1,
    title: "JavaScript Cơ bản",
    description: "Học lập trình JavaScript từ đầu",
    students: 342,
    exercises: 24,
    rating: 4.5,
    progress: 78,
    status: "Đã xuất bản",
    color: "#f59e0b",
    instructor: "Lê Văn C",
  },
  {
    id: 2,
    title: "React Fundamentals",
    description: "Làm chủ React library",
    students: 289,
    exercises: 18,
    rating: 4.8,
    progress: 65,
    status: "Đã xuất bản",
    color: "#3b82f6",
    instructor: "Lê Văn C",
  },
  {
    id: 3,
    title: "Python cho người mới",
    description: "Lập trình Python từ cơ bản đến nâng cao",
    students: 256,
    exercises: 32,
    rating: 4.7,
    progress: 82,
    status: "Đã xuất bản",
    color: "#10b981",
    instructor: "Trần Văn D",
  },
  {
    id: 4,
    title: "Java nâng cao",
    description: "Học kỹ thuật Java chuyên sâu",
    students: 198,
    exercises: 27,
    rating: 4.3,
    progress: 59,
    status: "Bản nháp",
    color: "#a855f7",
    instructor: "Nguyễn Văn B",
  },
  ...Array.from({ length: 10 }, (_, i) => ({
    id: i + 5,
    title: `Khóa học ${i + 5}`,
    description: "Khóa học tự động sinh ra để test phân trang",
    students: 100 + i * 5,
    exercises: 10 + i,
    rating: 4 + (i % 5) * 0.1,
    progress: 40 + i * 5,
    status: i % 2 === 0 ? "Đã xuất bản" : "Bản nháp",
    color: i % 2 === 0 ? "#06b6d4" : "#f97316",
    instructor: "Giảng viên Demo",
  })),
];


// ==========================================================
// LOGIC TÍNH TOÁN SỐ CỘT (FIXED)
// Dựa trên CHIỀU RỘNG THỰC TẾ của grid, không phải window
// ==========================================================
const getNumberOfColumns = (
  gridWidth: number,
  windowWidth: number
): number => {
  // 1. Ưu tiên kiểm tra media query của mobile (dựa trên window)
  if (windowWidth <= 768) {
    return 1;
  }

  // 2. Nếu không phải mobile, tính số cột dựa trên gridWidth (auto-fill)
  // Breakpoint 3 cột: (280*3 + 24*2) = 888px
  if (gridWidth < 888) {
    return 2; // (Vì 1 cột đã bị check ở trên)
  }
  // Breakpoint 4 cột: (280*4 + 24*3) = 1192px
  if (gridWidth < 1192) {
    return 3;
  }
  
  // 4 cột trở lên
  return 4; 
};

// ==========================================================
// LOGIC TÍNH ITEMS_PER_PAGE (THEO YÊU CẦU MỚI)
// ==========================================================
const getItemsPerPage = (gridWidth: number, windowWidth: number): number => {
  const numCols = getNumberOfColumns(gridWidth, windowWidth);

  if (numCols === 1 || numCols === 2) {
    return 6; // Yêu cầu: 1 và 2 cột -> 6 card
  }

  if (numCols === 3) {
    return 6; // Yêu cầu: 3 cột * 2 hàng = 6 card
  }

  if (numCols === 4) {
    return 8; // Yêu cầu: 4 cột * 2 hàng = 8 card
  }

  // Xử lý trường hợp 5 cột trở lên (vẫn là 2 hàng)
  return numCols * 2;
};


const Courses = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tất cả");
  const [page, setPage] = useState(1);

  // === BẮT ĐẦU LOGIC RESPONSIVE MỚI ===
  const [itemsPerPage, setItemsPerPage] = useState(6); // Giá trị khởi tạo
  const gridRef = useRef<HTMLDivElement>(null); // Ref cho grid

  useEffect(() => {
    const gridEl = gridRef.current;
    if (!gridEl) return;

    // Hàm cập nhật state
    const updateItemsPerPage = () => {
      const gridWidth = gridEl.getBoundingClientRect().width;
      const windowWidth = window.innerWidth;
      const newItemsPerPage = getItemsPerPage(gridWidth, windowWidth);
      setItemsPerPage(newItemsPerPage);
    };

    // 1. Chạy 1 lần lúc đầu
    updateItemsPerPage();

    // 2. Lắng nghe window resize (cho media query 768px)
    window.addEventListener("resize", updateItemsPerPage);

    // 3. Lắng nghe grid resize (cho sidebar)
    const resizeObserver = new ResizeObserver(updateItemsPerPage);
    resizeObserver.observe(gridEl);

    // Dọn dẹp
    return () => {
      window.removeEventListener("resize", updateItemsPerPage);
      resizeObserver.unobserve(gridEl);
    };
  }, []);
  // === KẾT THÚC LOGIC RESPONSIVE MỚI ===


  const filtered = mockCourses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "Tất cả" || c.status === filter)
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (page - 1) * itemsPerPage;
  const currentCourses = filtered.slice(startIdx, startIdx + itemsPerPage);

  // Reset page nếu resize làm thay đổi tổng số trang
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [page, totalPages]);

  // (Tính toán stats, không đổi)
  const totalCourses = mockCourses.length;
  const publishedCourses = mockCourses.filter(
    (c) => c.status === "Đã xuất bản"
  ).length;
  const avgRating = 4.6;
  const growth = "+12%";

  return (
    <div className="courses-page">
      {/* ===== Stats ===== */}
      <div className="stats">
        <div className="stat-card blue">
          <FaBook className="icon" />
          <div>
            <p>Tổng khóa học</p>
            <h3>{totalCourses}</h3>
          </div>
        </div>
        <div className="stat-card green">
          <FaEye className="icon" />
          <div>
            <p>Đã xuất bản</p>
            <h3>{publishedCourses}</h3>
          </div>
        </div>
        <div className="stat-card orange">
          <FaStar className="icon" />
          <div>
            <p>Đánh giá TB</p>
            <h3>{avgRating}</h3>
          </div>
        </div>
        <div className="stat-card purple">
          <FaChartLine className="icon" />
          <div>
            <p>Tăng trưởng</p>
            <h3>{growth}</h3>
          </div>
        </div>
      </div>

      {/* ===== Search + Filter + Add ===== */}
      <div className="search-row">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm khóa học..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
        >
          <option>Tất cả</option>
          <option>Đã xuất bản</option>
          <option>Bản nháp</option>
        </select>
        <button className="add-btn">
          <FaPlus /> Thêm khóa học
        </button>
      </div>

      {/* ===== Cards (THÊM REF) ===== */}
      <div className="courses-grid" ref={gridRef}>
        {currentCourses.map((c) => (
          <div key={c.id} className="course-card">
            {/* === Phần trên (có màu) === */}
            <div className="card-top" style={{ background: c.color }}>
              <div className="card-top-header">
                <div className="card-icon-wrapper">
                  <FaBook className="icon" />
                </div>
                <FaEllipsisH className="menu-icon" />
              </div>
              <span
                className={`status ${
                  c.status === "Đã xuất bản" ? "published" : "draft"
                }`}
              >
                {c.status}
              </span>
            </div>

            {/* === Phần dưới (màu trắng) === */}
            <div className="card-bottom">
              <h3 className="title">{c.title}</h3>
              <p className="desc">{c.description}</p>

              <div className="info-row">
                <div className="info-item">
                  <FaUserGraduate className="info-icon" />
                  <p>Học viên</p>
                  <strong>{c.students}</strong>
                </div>
                <div className="info-item">
                  <FaClipboardList className="info-icon" />
                  <p>Bài tập</p>
                  <strong>{c.exercises}</strong>
                </div>
                <div className="info-item">
                  <FaStar className="info-icon" />
                  <p>Đánh giá</p>
                  <strong>
                    {c.rating}
                    <FaStar
                      style={{
                        color: "#f59e0b",
                        fontSize: "0.9em",
                        marginLeft: "4px",
                      }}
                    />
                  </strong>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-labels">
                  <p>Tiến độ TB</p>
                  <strong>{c.progress}%</strong>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{ width: `${c.progress}%`, background: c.color }}
                  ></div>
                </div>
              </div>

              <div className="instructor">
                <div className="avatar">
                  {c.instructor
                    .split(" ")
                    .map((name) => name.charAt(0))
                    .join("")}
                </div>
                <div className="instructor-details">
                  <p className="instructor-title">Giảng viên</p>
                  <p className="instructor-name">{c.instructor}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Pagination ===== */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={page === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default Courses;