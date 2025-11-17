import { useState, useEffect, useRef } from 'react';
// Dùng react-icons thay vì lucide-react
import {
  FaCode,
  FaCheck,
  FaBullseye, // Dùng FaBullseye cho "Target"
  FaChartLine,
  FaSearch,
  FaFilter,
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEllipsisV, // "MoreVertical"
  FaPen, // "Edit"
  FaTrash, // "Trash2"
  FaEye,
  FaPlay,
  FaArchive,
  FaDownload,
  FaChartBar, // "BarChart3"
  FaTasks, // "FileCheck"
  FaCopy,
} from 'react-icons/fa';
import './ExercisesManagement.scss'; // Import file SCSS của bạn

// Định nghĩa interface
interface Exercise {
  id: number;
  title: string;
  course: string;
  difficulty: 'easy' | 'medium' | 'hard';
  submissions: number;
  avgScore: number;
  timeLimit: number;
  passRate: number;
  color: string; // Đây là class màu gradient cho icon nền
}

// ==========================================================
// DATA MOCK (Khớp với hình ảnh)
// ==========================================================
const stats = [
  { label: 'Tổng bài tập', value: '156', icon: FaCode, colorClass: 'icon-blue' },
  { label: 'Hoàn thành', value: '1,234', icon: FaCheck, colorClass: 'icon-green' },
  { label: 'Tỷ lệ đạt TB', value: '76%', icon: FaBullseye, colorClass: 'icon-purple' },
  { label: 'Điểm TB', value: '82', icon: FaChartLine, colorClass: 'icon-orange' },
];

const exercisesData: Exercise[] = [
  { id: 1, title: 'Thuật toán sắp xếp', course: 'JavaScript Cơ bản', difficulty: 'medium', submissions: 156, avgScore: 85, timeLimit: 30, passRate: 78, color: 'icon-bg-yellow' },
  { id: 2, title: 'Promise và Async/Await', course: 'Java Script Nâng cao', difficulty: 'hard', submissions: 89, avgScore: 72, timeLimit: 45, passRate: 65, color: 'icon-bg-pink' },
  { id: 3, title: 'Component trong React', course: 'React cơ bản', difficulty: 'easy', submissions: 234, avgScore: 91, timeLimit: 20, passRate: 89, color: 'icon-bg-teal' },
  { id: 4, title: 'State Management', course: 'React nâng cao', difficulty: 'hard', submissions: 67, avgScore: 68, timeLimit: 60, passRate: 58, color: 'icon-bg-purple' },
  { id: 5, title: 'API Integration', course: 'JavaScript Nâng cao', difficulty: 'medium', submissions: 143, avgScore: 79, timeLimit: 40, passRate: 72, color: 'icon-bg-blue' },
  { id: 6, title: 'Vòng lặp và mảng', course: 'JavaScript Cơ bản', difficulty: 'easy', submissions: 312, avgScore: 94, timeLimit: 15, passRate: 92, color: 'icon-bg-green' },
  // Thêm data để test phân trang (10 items/page)
  { id: 7, title: 'DOM Manipulation', course: 'JavaScript Cơ bản', difficulty: 'easy', submissions: 188, avgScore: 88, timeLimit: 25, passRate: 81, color: 'icon-bg-teal' },
  { id: 8, title: 'React Hooks', course: 'React cơ bản', difficulty: 'medium', submissions: 132, avgScore: 82, timeLimit: 35, passRate: 75, color: 'icon-bg-blue' },
  { id: 9, title: 'Data Structures', course: 'Thuật toán', difficulty: 'hard', submissions: 55, avgScore: 61, timeLimit: 60, passRate: 50, color: 'icon-bg-pink' },
  { id: 10, title: 'Python Classes', course: 'Python Nâng cao', difficulty: 'medium', submissions: 98, avgScore: 85, timeLimit: 30, passRate: 79, color: 'icon-bg-yellow' },
  { id: 11, title: 'Test Bài Tập Trang 2 - Item 1', course: 'React cơ bản', difficulty: 'easy', submissions: 1, avgScore: 100, timeLimit: 10, passRate: 100, color: 'icon-bg-green' },
  { id: 12, title: 'Test Bài Tập Trang 2 - Item 2', course: 'JavaScript Nâng cao', difficulty: 'hard', submissions: 5, avgScore: 40, timeLimit: 50, passRate: 30, color: 'icon-bg-pink' },
];

const EXERCISES_PER_PAGE = 10; // Đúng yêu cầu 10 dòng/trang

export default function ExercisesManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const menuRef = useRef<HTMLDivElement>(null); // Ref cho dropdown menu

  // Logic lọc
  const filteredExercises = exercisesData.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
    const matchesCourse = selectedCourse === 'all' || exercise.course === selectedCourse;
    return matchesSearch && matchesDifficulty && matchesCourse;
  });

  // Logic phân trang
  const totalPages = Math.ceil(filteredExercises.length / EXERCISES_PER_PAGE);
  const startIndex = (currentPage - 1) * EXERCISES_PER_PAGE;
  const currentExercises = filteredExercises.slice(startIndex, startIndex + EXERCISES_PER_PAGE);

  // Logic chọn tất cả (cho trang hiện tại)
  const currentPageIds = currentExercises.map(e => e.id);
  const isAllCurrentPageSelected = currentPageIds.length > 0 && currentPageIds.every(id => selectedExercises.includes(id));

  const toggleAllExercises = () => {
    if (isAllCurrentPageSelected) {
      // Nếu tất cả đã được chọn -> Bỏ chọn tất cả (chỉ trang này)
      setSelectedExercises(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      // Nếu chưa chọn hết -> Chọn tất cả (chỉ trang này)
      setSelectedExercises(prev => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  const toggleExerciseSelection = (exerciseId: number) => {
    setSelectedExercises(prev =>
      prev.includes(exerciseId) ? prev.filter(id => id !== exerciseId) : [...prev, exerciseId]
    );
  };

  // Logic đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Chỉ đóng nếu click ra ngoài menu *và* không phải click vào nút trigger
      if (openMenuId !== null && menuRef.current && !menuRef.current.contains(event.target as Node)) {
          const triggerButton = (event.target as Element).closest('.menu-trigger-btn');
          if(!triggerButton) {
             setOpenMenuId(null);
          }
      }
    };

    document.addEventListener("mousedown", handleOutsideClick); // Dùng mousedown tốt hơn click
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [openMenuId]); // Chạy lại mỗi khi openMenuId thay đổi

  // Hàm helper cho badge (khớp hình ảnh mới)
  const getDifficultyBadge = (difficulty: 'easy' | 'medium' | 'hard') => {
    const classMap = {
      easy: 'badge-easy',
      medium: 'badge-medium',
      hard: 'badge-hard',
    };
    const textMap = {
      easy: 'Dễ',
      medium: 'Trung bình',
      hard: 'Khó',
    };
    return <span className={`badge ${classMap[difficulty]}`}>{textMap[difficulty]}</span>;
  };

  // Hàm helper cho thanh điểm TB (khớp hình ảnh mới)
  const getScoreBarColor = (score: number): string => {
    if (score >= 90) return 'score-bar-teal'; // Màu xanh lá cây đậm (Teal)
    if (score >= 80) return 'score-bar-yellow'; // Màu vàng cam
    if (score >= 70) return 'score-bar-blue'; // Màu xanh dương
    if (score >= 60) return 'score-bar-pink'; // Màu hồng
    return 'score-bar-purple'; // Màu tím
  };

  return (
    <div className="exercises-management-page">
      {/* ===== 1. Stats Cards ===== */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div>
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
            <div className={`stat-icon-wrapper ${stat.colorClass}`}>
              <stat.icon className="stat-icon" />
            </div>
          </div>
        ))}
      </div>

      {/* ===== 2. Header (Search, Filters, Button) ===== */}
      <div className="header-row">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm bài tập..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset về trang 1 khi search
            }}
          />
        </div>
        <div className="filters-and-actions">
          <div className="filter-wrapper">
            <FaFilter className="filter-icon" />
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setCurrentPage(1); // Reset về trang 1 khi filter
              }}
            >
              <option value="all">Tất cả độ khó</option>
              <option value="easy">Dễ</option>
              <option value="medium">Trung bình</option>
              <option value="hard">Khó</option>
            </select>
          </div>
          <div className="filter-wrapper">
            <FaFilter className="filter-icon" />
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setCurrentPage(1); // Reset về trang 1 khi filter
              }}
            >
              <option value="all">Tất cả khóa học</option>
              <option value="JavaScript Cơ bản">JavaScript Cơ bản</option>
              <option value="JavaScript Nâng cao">JavaScript Nâng cao</option>
              <option value="React cơ bản">React cơ bản</option>
              <option value="React nâng cao">React nâng cao</option>
              <option value="Thuật toán">Thuật toán</option>
              <option value="Python Nâng cao">Python Nâng cao</option>
            </select>
          </div>
          <button className="add-button">
            <FaPlus /> Thêm bài tập
          </button>
        </div>
      </div>

      {/* ===== 3. Bảng Bài tập ===== */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={isAllCurrentPageSelected}
                  onChange={toggleAllExercises}
                  disabled={currentPageIds.length === 0} // Disable nếu không có bài nào trên trang
                />
              </th>
              <th>Bài tập</th>
              <th>Khóa học</th>
              <th>Độ khó</th>
              <th>Bài nộp</th>
              <th>Tỷ lệ đạt</th>
              <th>Điểm TB</th>
              <th>Thời gian</th>
              <th></th>{/* Cột cho nút ... */}
            </tr>
          </thead>
          <tbody>
            {currentExercises.map((exercise) => (
              <tr key={exercise.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedExercises.includes(exercise.id)}
                    onChange={() => toggleExerciseSelection(exercise.id)}
                  />
                </td>
                <td>
                  <div className="cell-exercise-title">
                    <div className={`icon-wrapper ${exercise.color}`}>
                      <FaCode className="icon" />
                    </div>
                    <span>{exercise.title}</span>
                  </div>
                </td>
                <td>{exercise.course}</td>
                <td>{getDifficultyBadge(exercise.difficulty)}</td>
                <td>{exercise.submissions}</td>
                <td>
                  <div className={`cell-pass-rate ${exercise.passRate >= 70 ? 'pass' : 'fail'}`}>
                    {exercise.passRate >= 70 ? (
                      <FaCheckCircle className="icon" />
                    ) : (
                      <FaTimesCircle className="icon" />
                    )}
                    <span>{exercise.passRate}%</span>
                  </div>
                </td>
                <td>
                  <div className="cell-score-bar">
                    <div className="score-bar-bg">
                      <div
                        className={`score-bar-fill ${getScoreBarColor(exercise.avgScore)}`}
                        style={{ width: `${exercise.avgScore}%` }}
                      ></div>
                    </div>
                    <span className="score-value">{exercise.avgScore}</span>
                  </div>
                </td>
                <td>
                  <div className="cell-time">
                    <FaClock className="icon" />
                    <span>{exercise.timeLimit}m</span>
                  </div>
                </td>
                <td>
                  {/* Sử dụng ref ở đây */}
                  <div className="menu-container" ref={openMenuId === exercise.id ? menuRef : null}>
                    <button
                      className="menu-trigger-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn sự kiện click lan ra document
                        setOpenMenuId(openMenuId === exercise.id ? null : exercise.id);
                      }}
                    >
                      <FaEllipsisV />
                    </button>
                    {openMenuId === exercise.id && (
                      <div
                        className="dropdown-menu"
                        onClick={(e) => e.stopPropagation()} // Ngăn click vào menu làm đóng menu
                      >
                        {/* Các action giống như dropdown cũ */}
                        <button className="menu-item"><FaEye /> Xem chi tiết</button>
                        <button className="menu-item"><FaPen /> Chỉnh sửa</button>
                        <button className="menu-item"><FaCopy /> Nhân bản</button>
                        <button className="menu-item"><FaPlay /> Xem bài nộp</button>
                        <button className="menu-item"><FaChartBar /> Xem thống kê</button>
                        <button className="menu-item"><FaTasks /> Chạy test</button>
                        <button className="menu-item"><FaDownload /> Xuất bài tập</button>
                        <button className="menu-item"><FaArchive /> Lưu trữ</button>
                        <button className="menu-item delete"><FaTrash /> Xóa</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
             {/* Thêm dòng trống nếu dữ liệu ít hơn số dòng mỗi trang */}
             {currentExercises.length < EXERCISES_PER_PAGE &&
               Array.from({ length: EXERCISES_PER_PAGE - currentExercises.length }).map((_, index) => (
                 <tr key={`empty-${index}`} className="empty-row">
                   {/* Số cột phải bằng số lượng <th> */}
                   <td colSpan={9}>&nbsp;</td>
                 </tr>
             ))}
          </tbody>
        </table>
      </div>

      {/* ===== 4. Phân trang ===== */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            &larr;
          </button>
          {/* Chỉ hiển thị số trang nếu <= 7 trang, nếu > 7 thì dùng ... */}
          {totalPages <= 7 ? (
             Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? 'active' : ''}
              >
                {page}
              </button>
            ))
          ) : (
            <>
              <button onClick={() => setCurrentPage(1)} className={currentPage === 1 ? 'active' : ''}>1</button>
              {currentPage > 3 && <span>...</span>}
              {/* Hiển thị trang hiện tại và 1 trang trước/sau */}
              {currentPage > 2 && <button onClick={() => setCurrentPage(currentPage - 1)}>{currentPage - 1}</button>}
              {currentPage !== 1 && currentPage !== totalPages && <button className="active">{currentPage}</button>}
              {currentPage < totalPages - 1 && <button onClick={() => setCurrentPage(currentPage + 1)}>{currentPage + 1}</button>}
              {currentPage < totalPages - 2 && <span>...</span>}
              <button onClick={() => setCurrentPage(totalPages)} className={currentPage === totalPages ? 'active' : ''}>{totalPages}</button>
            </>
          )}

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            &rarr;
          </button>
        </div>
      )}
    </div>
  );
}