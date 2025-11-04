import React, { useState } from "react";
import "./Users.scss";
import {
  FaUserGraduate,
  FaChartLine,
  FaClipboardCheck,
  FaChartBar,
  FaPlus,
  FaEnvelope,
  FaFileExport,
  FaFilter,
  FaEllipsisV,
} from "react-icons/fa";

interface User {
  name: string;
  email: string;
  role: string;
  courses: number;
  progress: number;
  status: string;
  joinDate: string;
  color: string;
}

const mockUsers: User[] = [
  { name: "Nguyễn Văn A", email: "nguyenvana@email.com", role: "Học viên", courses: 3, progress: 78, status: "Hoạt động", joinDate: "15/01/2025", color: "#3b82f6" },
  { name: "Trần Thị B", email: "tranthib@email.com", role: "Học viên", courses: 5, progress: 65, status: "Hoạt động", joinDate: "12/01/2025", color: "#10b981" },
  { name: "Lê Văn C", email: "levanc@email.com", role: "Giảng viên", courses: 2, progress: 100, status: "Hoạt động", joinDate: "08/01/2025", color: "#8b5cf6" },
  { name: "Phạm Thị D", email: "phamthid@email.com", role: "Học viên", courses: 1, progress: 23, status: "Không hoạt động", joinDate: "05/01/2025", color: "#f59e0b" },
  { name: "Hoàng Văn E", email: "hoangvane@email.com", role: "Học viên", courses: 4, progress: 89, status: "Hoạt động", joinDate: "03/01/2025", color: "#06b6d4" },
  { name: "Vũ Thị F", email: "vuthif@email.com", role: "Học viên", courses: 2, progress: 56, status: "Hoạt động", joinDate: "01/01/2025", color: "#22c55e" },
];

const UsersManagement: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [openAction, setOpenAction] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const filtered = mockUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "Tất cả" ? true : u.role === roleFilter;
    const matchStatus = statusFilter === "Tất cả" ? true : u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Kiểm tra: tất cả user trong trang hiện tại đã được chọn chưa
  const isPageFullySelected = paginated.length > 0 && paginated.every(u => selectedUsers.includes(u.email));

  // Khi tick chọn tất cả trên trang: thêm (merge) hoặc xóa (remove) emails của *trang hiện tại* vào selectedUsers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // add paginated emails (unique)
      setSelectedUsers(prev => {
        const setPrev = new Set(prev);
        paginated.forEach(u => setPrev.add(u.email));
        return Array.from(setPrev);
      });
    } else {
      // remove paginated emails
      setSelectedUsers(prev => prev.filter(email => !paginated.some(u => u.email === email)));
    }
  };

  const handleSelectUser = (email: string) => {
    setSelectedUsers((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  // reset trang khi filter/search thay đổi (optional UX): đưa lại page 1
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, statusFilter]);

  return (
    <div className="users-page">
      {/* ===== Stats Cards ===== */}
      <div className="stats">
        <div className="stat-card blue">
          <FaUserGraduate className="icon" />
          <div>
            <p className="label">Tổng học viên</p>
            <h3>1,284</h3>
            <span className="trend up">▲ +12%</span>
          </div>
        </div>
        <div className="stat-card green">
          <FaChartLine className="icon" />
          <div>
            <p className="label">Đang hoạt động</p>
            <h3>892</h3>
            <span className="trend up">▲ +8%</span>
          </div>
        </div>
        <div className="stat-card purple">
          <FaClipboardCheck className="icon" />
          <div>
            <p className="label">Hoàn thành khóa</p>
            <h3>456</h3>
            <span className="trend up">▲ +15%</span>
          </div>
        </div>
        <div className="stat-card orange">
          <FaChartBar className="icon" />
          <div>
            <p className="label">Tăng trưởng</p>
            <h3>24%</h3>
            <span className="trend up">▲ +5%</span>
          </div>
        </div>
      </div>

      {/* ===== Search + Add ===== */}
      <div className="search-row">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm học viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="add-btn">
          <FaPlus /> Thêm học viên
        </button>
      </div>

      {/* ===== Filters + Actions ===== */}
      <div className="filter-bar">
        <div className="filter-group">
          <FaFilter className="filter-icon" />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option>Tất cả vai trò</option>
            <option>Học viên</option>
            <option>Giảng viên</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>Tất cả trạng thái</option>
            <option>Hoạt động</option>
            <option>Không hoạt động</option>
          </select>
        </div>

        {selectedUsers.length > 0 && (
          <div className="actions-right">
            <button className="email-btn">
              <span className="btn-badge">{selectedUsers.length}</span>
              <FaEnvelope /> Gửi mail
            </button>
            <button className="export-btn">
              <span className="btn-badge">{selectedUsers.length}</span>
              <FaFileExport /> Export
            </button>
          </div>
        )}
      </div>

      {/* ===== Table ===== */}
      <table className="users-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={isPageFullySelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </th>
            <th>Học viên</th>
            <th>Vai trò</th>
            <th>Khóa học</th>
            <th>Tiến độ</th>
            <th>Trạng thái</th>
            <th>Ngày tham gia</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((u) => (
            <tr key={u.email}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(u.email)}
                  onChange={() => handleSelectUser(u.email)}
                />
              </td>
              <td className="user">
                <div className="avatar" style={{ background: u.color }}>
                  {u.name.charAt(0)}
                </div>
                <div>
                  <p className="name">{u.name}</p>
                  <p className="email">{u.email}</p>
                </div>
              </td>
              <td><span className={`role ${u.role === "Giảng viên" ? "teacher" : "student"}`}>{u.role}</span></td>
              <td>{u.courses} khóa học</td>
              <td>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${u.progress}%` }}></div>
                </div>
                <span className="percent">{u.progress}%</span>
              </td>
              <td>
                <span className={`status ${u.status === "Hoạt động" ? "active" : "inactive"}`}>
                  {u.status}
                </span>
              </td>
              <td>{u.joinDate}</td>
              <td className="actions-cell">
                <button
                  className="more-btn"
                  onClick={() => setOpenAction(openAction === u.email ? null : u.email)}
                >
                  <FaEllipsisV />
                </button>
                {openAction === u.email && (
                  <div className="dropdown">
                    <button>Sửa</button>
                    <button>Xóa</button>
                    <button>Chặn</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== Pagination (dashboard style) ===== */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
