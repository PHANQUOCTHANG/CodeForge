import React, { useState, useCallback } from "react";
import type { UserFilters } from "@/features/user/types";
import "./styles/UserFilters.scss";

interface UserFiltersProps {
  onFilterChange?: (filters: UserFilters) => void;
  onSearchChange?: (search: string) => void;
}

/**
 * Component tìm kiếm và lọc danh sách user
 */
export const UserFilters: React.FC<UserFiltersProps> = ({
  onFilterChange,
  onSearchChange,
}) => {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle search input with debounce
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      onSearchChange?.(value);
    },
    [onSearchChange]
  );

  // Handle filter changes
  const handleFilterChange = useCallback(() => {
    const filters: UserFilters = {
      search: search || undefined,
      role: (role || undefined) as any,
      status: (status || undefined) as any,
    };
    onFilterChange?.(filters);
  }, [search, role, status, onFilterChange]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setRole(value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatus(value);
  };

  const handleApplyFilters = () => {
    handleFilterChange();
    setIsExpanded(false);
  };

  const handleResetFilters = () => {
    setSearch("");
    setRole("");
    setStatus("");
    onSearchChange?.("");
    onFilterChange?.({});
    setIsExpanded(false);
  };

  const hasActiveFilters = search || role || status;

  return (
    <div className="user-filters">
      <div className="user-filters__header">
        <div className="user-filters__search">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, username..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="user-filters__search-input"
          />
          <svg
            className="user-filters__search-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>

        <button
          className={`user-filters__toggle ${
            isExpanded ? "user-filters__toggle--active" : ""
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
          Bộ lọc
          {hasActiveFilters && <span className="user-filters__badge">●</span>}
        </button>
      </div>

      {isExpanded && (
        <div className="user-filters__expanded">
          <div className="user-filters__filters">
            {/* Role Filter */}
            <div className="user-filters__group">
              <label className="user-filters__label">Role</label>
              <select
                value={role}
                onChange={handleRoleChange}
                className="user-filters__select"
              >
                <option value="">Tất cả</option>
                <option value="user">Học viên</option>
                <option value="instructor">Giảng viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="user-filters__group">
              <label className="user-filters__label">Trạng thái</label>
              <select
                value={status}
                onChange={handleStatusChange}
                className="user-filters__select"
              >
                <option value="">Tất cả</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="suspended">Bị khóa</option>
              </select>
            </div>
          </div>

          <div className="user-filters__actions">
            <button
              className="user-filters__btn user-filters__btn--reset"
              onClick={handleResetFilters}
            >
              Đặt lại
            </button>
            <button
              className="user-filters__btn user-filters__btn--apply"
              onClick={handleApplyFilters}
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFilters;
