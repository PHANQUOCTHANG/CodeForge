import React from "react";
import type { UserDto } from "@/features/user/types";
import {
  getRoleColor,
  getStatusColor,
  getRoleLabel,
  getStatusLabel,
} from "@/features/user/utils/userUtils";
import "./styles/UserTable.scss";

interface UserTableProps {
  users: UserDto[];
  isLoading?: boolean;
  onEdit?: (user: UserDto) => void;
  onDelete?: (userId: string) => void;
  onRowClick?: (user: UserDto) => void;
}

/**
 * Component hiển thị bảng danh sách user
 */
export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  onEdit,
  onDelete,
  onRowClick,
}) => {
  if (isLoading) {
    return <div className="user-table__loading">Đang tải dữ liệu...</div>;
  }

  if (users.length === 0) {
    return <div className="user-table__empty">Không có người dùng nào</div>;
  }

  return (
    <div className="user-table">
      <div className="user-table__wrapper">
        <table className="user-table__table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Role</th>
              <th>Trạng thái</th>
              <th>Khóa học</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.userId}
                className="user-table__row"
                onClick={() => onRowClick?.(user)}
              >
                <td className="user-table__cell">
                  <div className="user-table__user">
                    <img
                      src={
                        user.avatar ||
                        "https://via.placeholder.com/32?text=User"
                      }
                      alt={user.fullName}
                      className="user-table__avatar"
                    />
                    <div className="user-table__user-info">
                      <p className="user-table__name">{user.fullName}</p>
                      <p className="user-table__username">@{user.username}</p>
                    </div>
                  </div>
                </td>
                <td className="user-table__cell">{user.email}</td>
                <td className="user-table__cell">
                  <span
                    className="user-table__badge"
                    style={{
                      backgroundColor: `${getRoleColor(user.role)}20`,
                      color: getRoleColor(user.role),
                    }}
                  >
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className="user-table__cell">
                  <span
                    className="user-table__badge"
                    style={{
                      backgroundColor: `${getStatusColor(user.status)}20`,
                      color: getStatusColor(user.status),
                    }}
                  >
                    {getStatusLabel(user.status)}
                  </span>
                </td>
                <td className="user-table__cell">
                  {user.enrolledCourses || 0}
                </td>
                <td className="user-table__cell user-table__actions">
                  {onEdit && (
                    <button
                      className="user-table__action-btn user-table__action-btn--edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(user);
                      }}
                    >
                      Sửa
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="user-table__action-btn user-table__action-btn--delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(user.userId);
                      }}
                    >
                      Xóa
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
