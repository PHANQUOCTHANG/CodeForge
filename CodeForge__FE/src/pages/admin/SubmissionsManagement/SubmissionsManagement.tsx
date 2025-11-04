import { useState, useEffect } from 'react';
// Dùng react-icons thay vì lucide-react
import {
  FaSearch,
  FaCode,
  FaClock,
  FaCalendarAlt, // Icon lịch
  FaEye,         // Icon mắt
  FaTimes,       // Icon X để đóng modal
  FaCheckCircle, // Icon test passed
  FaTimesCircle, // Icon test failed
} from 'react-icons/fa';
import './SubmissionsManagement.scss'; // Import file SCSS

// Định nghĩa interface cho bài nộp
interface Submission {
  id: number;
  student: string;
  exercise: string;
  course: string;
  status: 'passed' | 'failed' | 'pending';
  score: number | null;
  submittedAt: string; // Format: 'DD/MM/YYYY HH:MM'
  executionTime: string; // ví dụ: '125ms' hoặc '-'
  testsPassed: string; // ví dụ: '10/10' hoặc '-'
}

// ==========================================================
// DATA MOCK (Khớp với hình ảnh)
// ==========================================================
const submissionsData: Submission[] = [
  { id: 1, student: 'Nguyễn Văn A', exercise: 'Thuật toán sắp xếp', course: 'JavaScript Cơ bản', status: 'passed', score: 95, submittedAt: '14/10/2025 14:30', executionTime: '125ms', testsPassed: '10/10' },
  { id: 2, student: 'Trần Thị B', exercise: 'Promise và Async/Await', course: 'JavaScript Nâng cao', status: 'failed', score: 45, submittedAt: '14/10/2025 14:18', executionTime: '89ms', testsPassed: '4/10' },
  { id: 3, student: 'Lê Văn C', exercise: 'Component trong React', course: 'React cơ bản', status: 'passed', score: 88, submittedAt: '14/10/2025 14:12', executionTime: '156ms', testsPassed: '9/10' },
  { id: 4, student: 'Phạm Thị D', exercise: 'State Management', course: 'React nâng cao', status: 'pending', score: null, submittedAt: '14/10/2025 14:05', executionTime: '-', testsPassed: '-' },
  { id: 5, student: 'Hoàng Văn E', exercise: 'API Integration', course: 'JavaScript Nâng cao', status: 'passed', score: 92, submittedAt: '14/10/2025 13:58', executionTime: '234ms', testsPassed: '10/10' },
  { id: 6, student: 'Vũ Thị F', exercise: 'Vòng lặp và mảng', course: 'JavaScript Cơ bản', status: 'passed', score: 100, submittedAt: '14/10/2025 13:45', executionTime: '67ms', testsPassed: '8/8' },
  // Thêm data để test phân trang (10 items/page)
  { id: 7, student: 'Đặng Thị G', exercise: 'DOM Manipulation', course: 'JavaScript Cơ bản', status: 'passed', score: 85, submittedAt: '14/10/2025 13:30', executionTime: '110ms', testsPassed: '7/8' },
  { id: 8, student: 'Ngô Văn H', exercise: 'React Hooks', course: 'React cơ bản', status: 'failed', score: 55, submittedAt: '14/10/2025 13:25', executionTime: '95ms', testsPassed: '5/10' },
  { id: 9, student: 'Bùi Thị I', exercise: 'Data Structures', course: 'Thuật toán', status: 'passed', score: 78, submittedAt: '14/10/2025 13:15', executionTime: '180ms', testsPassed: '8/10' },
  { id: 10, student: 'Dương Văn K', exercise: 'Python Classes', course: 'Python Nâng cao', status: 'pending', score: null, submittedAt: '14/10/2025 13:00', executionTime: '-', testsPassed: '-' },
  { id: 11, student: 'Lý Thị L', exercise: 'Thuật toán sắp xếp', course: 'JavaScript Cơ bản', status: 'passed', score: 98, submittedAt: '14/10/2025 12:55', executionTime: '105ms', testsPassed: '10/10' },
  { id: 12, student: 'Mai Văn M', exercise: 'Promise và Async/Await', course: 'JavaScript Nâng cao', status: 'passed', score: 80, submittedAt: '14/10/2025 12:40', executionTime: '130ms', testsPassed: '8/10' },
];

const SUBMISSIONS_PER_PAGE = 10; // Đúng yêu cầu 10 dòng/trang

// == THÊM SAMPLE CODE VÀ TEST CASES CHO DIALOG ==
const sampleCode = `function sortArray(arr) {
  // Bubble sort algorithm
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`;

const sampleTestCases = [
  { id: 1, input: '[5, 2, 8, 1, 9]', output: '[1, 2, 5, 8, 9]', status: 'passed' as const },
  { id: 2, input: '[3, 1, 4, 1, 5]', output: '[1, 1, 3, 4, 5]', status: 'passed' as const },
  { id: 3, input: '[-5, 0, 3, -2]', output: '[-5, -2, 0, 3]', status: 'passed' as const },
  { id: 4, input: '[10]', output: '[10]', status: 'passed' as const },
  { id: 5, input: '[]', output: '[]', status: 'passed' as const },
  { id: 6, input: '[1, 2, 3]', output: '[1, 2, 3]', status: 'passed' as const },
  // Giả sử có 1 test case failed
  { id: 7, input: '[9, 8, 7]', output: '[7, 8, 9]', status: 'failed' as const, actualOutput: '[9, 8, 7]' },
];
// =============================================

export default function SubmissionsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'tests' | 'feedback'>('code');


  // Logic lọc (chỉ lọc theo tên học viên hoặc tên bài tập)
  const filteredSubmissions = submissionsData.filter(submission =>
    submission.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
    submission.exercise.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Logic phân trang
  const totalPages = Math.ceil(filteredSubmissions.length / SUBMISSIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * SUBMISSIONS_PER_PAGE;
  const currentSubmissions = filteredSubmissions.slice(startIndex, startIndex + SUBMISSIONS_PER_PAGE);

  // Hàm helper cho badge trạng thái (khớp Figma)
  const getStatusBadge = (status: 'passed' | 'failed' | 'pending') => {
    const classMap = {
      passed: 'badge-passed',
      failed: 'badge-failed',
      pending: 'badge-pending',
    };
    const textMap = {
      passed: 'Đạt',
      failed: 'Không đạt',
      pending: 'Chờ chấm',
    };
    return <span className={`badge ${classMap[status]}`}>{textMap[status]}</span>;
  };

  // == THÊM EFFECT ĐỂ NGĂN SCROLL KHI DIALOG MỞ ==
  useEffect(() => {
    if (selectedSubmission) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedSubmission]);
  // =============================================


  return (
    <div className="submissions-management-page">
      {/* ===== 1. Header (Chỉ có Search) ===== */}
      <div className="header-row">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm bài nộp..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset về trang 1 khi search
            }}
          />
        </div>
        {/* Có thể thêm nút Filter hoặc Export sau nếu cần */}
      </div>

      {/* ===== 2. Bảng Bài nộp ===== */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {/* Bỏ cột checkbox */}
              <th>Học viên</th>
              <th>Bài tập</th>
              <th>Trạng thái</th>
              <th>Điểm</th>
              <th>Tests</th>
              <th>Thời gian</th>
              <th></th>{/* Cột cho nút Xem */}
            </tr>
          </thead>
          <tbody>
            {currentSubmissions.map((submission) => (
              <tr key={submission.id}>
                {/* <td> Bỏ checkbox </td> */}
                <td>
                  <div className="cell-student-info">
                    <span className="student-name">{submission.student}</span>
                    <span className="course-name">{submission.course}</span>
                  </div>
                </td>
                <td>
                  <div className="cell-exercise-title">
                    <FaCode className="icon" />
                    <span>{submission.exercise}</span>
                  </div>
                </td>
                <td>{getStatusBadge(submission.status)}</td>
                <td>
                  <span className="score-value">
                    {submission.score !== null ? `${submission.score}/100` : '-'}
                  </span>
                </td>
                <td>
                  <span className="tests-passed">{submission.testsPassed}</span>
                </td>
                <td>
                  <div className="cell-time-info">
                    <div className="time-row">
                      <FaCalendarAlt className="icon" />
                      <span>{submission.submittedAt}</span>
                    </div>
                    <div className="time-row">
                      <FaClock className="icon" />
                      <span>{submission.executionTime}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <button
                    className="view-button"
                    // === CẬP NHẬT onClick ĐỂ MỞ DIALOG ===
                    onClick={() => {
                      setSelectedSubmission(submission);
                      setActiveTab('code'); // Reset về tab code khi mở
                    }}
                    // ===================================
                  >
                    <FaEye className="icon" /> Xem
                  </button>
                </td>
              </tr>
            ))}
            {/* Thêm dòng trống nếu dữ liệu ít hơn số dòng mỗi trang */}
            {currentSubmissions.length < SUBMISSIONS_PER_PAGE &&
             Array.from({ length: SUBMISSIONS_PER_PAGE - currentSubmissions.length }).map((_, index) => (
               <tr key={`empty-${index}`} className="empty-row">
                 {/* Số cột phải bằng số lượng <th> (7 cột) */}
                 <td colSpan={7}>&nbsp;</td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>

      {/* ===== 3. Phân trang ===== */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            &larr;
          </button>
          {/* Logic phân trang giống trang Exercises */}
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

      {/* ================================================= */}
      {/* ===== 4. Dialog xem chi tiết bài nộp ===== */}
      {/* ================================================= */}
      {selectedSubmission && (
        <div className="dialog-overlay" onClick={() => setSelectedSubmission(null)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2 className="dialog-title">Chi tiết bài nộp</h2>
              <button className="dialog-close-btn" onClick={() => setSelectedSubmission(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="dialog-body">
              {/* --- Info Cards --- */}
              <div className="info-cards-grid">
                <div className="info-card">
                  <p className="info-label">Học viên</p>
                  <p className="info-value">{selectedSubmission.student}</p>
                </div>
                <div className="info-card">
                  <p className="info-label">Điểm</p>
                  <p className={`info-value ${selectedSubmission.score === null ? 'pending' : (selectedSubmission.score >= 50 ? 'passed' : 'failed')}`}>
                    {selectedSubmission.score !== null ? `${selectedSubmission.score}/100` : 'Chưa chấm'}
                  </p>
                </div>
                <div className="info-card">
                  <p className="info-label">Tests</p>
                  <p className="info-value">{selectedSubmission.testsPassed}</p>
                </div>
                <div className="info-card">
                  <p className="info-label">Thời gian chạy</p>
                  <p className="info-value">{selectedSubmission.executionTime}</p>
                </div>
              </div>

              {/* --- Tabs --- */}
              <div className="tabs-container">
                <div className="tabs-list">
                  <button
                    className={`tab-trigger ${activeTab === 'code' ? 'active' : ''}`}
                    onClick={() => setActiveTab('code')}
                  >
                    Code
                  </button>
                  <button
                    className={`tab-trigger ${activeTab === 'tests' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tests')}
                  >
                    Test Cases
                  </button>
                  <button
                    className={`tab-trigger ${activeTab === 'feedback' ? 'active' : ''}`}
                    onClick={() => setActiveTab('feedback')}
                  >
                    Nhận xét
                  </button>
                </div>
                <div className="tabs-content">
                  {/* --- Tab Code --- */}
                  {activeTab === 'code' && (
                    <div className="tab-panel">
                      <pre className="code-block">
                        <code>{sampleCode}</code>
                      </pre>
                    </div>
                  )}
                  {/* --- Tab Test Cases --- */}
                  {activeTab === 'tests' && (
                    <div className="tab-panel test-cases-panel">
                      {sampleTestCases.map((test) => (
                        <div key={test.id} className={`test-case-card ${test.status}`}>
                          <div className="test-case-header">
                            <span className="test-case-name">Test case #{test.id}</span>
                            <span className={`test-case-status ${test.status}`}>
                              {test.status === 'passed' ? <FaCheckCircle/> : <FaTimesCircle/>}
                              {test.status === 'passed' ? 'Passed' : 'Failed'}
                            </span>
                          </div>
                          <div className="test-case-body">
                             <pre>Input: {test.input}</pre>
                             <pre>Expected Output: {test.output}</pre>
                             {test.status === 'failed' && test.actualOutput && (
                               <pre className="failed">Actual Output: {test.actualOutput}</pre>
                             )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* --- Tab Feedback --- */}
                  {activeTab === 'feedback' && (
                    <div className="tab-panel feedback-panel">
                      <textarea
                        placeholder="Nhập nhận xét cho học viên..."
                        rows={6}
                      />
                      <button className="submit-feedback-btn">
                        Gửi nhận xét
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ================================================= */}
      {/* ===== KẾT THÚC DIALOG ===== */}
      {/* ================================================= */}
    </div>
  );
}