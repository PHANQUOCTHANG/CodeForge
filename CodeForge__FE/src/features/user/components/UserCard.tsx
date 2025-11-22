import React from "react";
import { X } from "lucide-react";
import type { UserDto } from "@/features/user/types";
import {
  getRoleColor,
  getStatusColor,
  getRoleLabel,
  getStatusLabel,
} from "@/features/user/utils/userUtils";
import "./styles/UserCard.scss";

interface UserCardProps {
  user: UserDto;
  onEdit?: (user: UserDto) => void;
  onDelete?: (userId: string) => void;
  isSelected?: boolean;
  onSelect?: (userId: string) => void;
}

/**
 * Component hiển thị một user card
 */
export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`user-card ${isSelected ? "user-card--selected" : ""}`}
      onClick={() => onSelect?.(user.userId)}
    >
      {/* Avatar & Name */}
      <div className="user-card__header">
        <img
          src={user.avatar || "https://via.placeholder.com/48?text=User"}
          alt={user.fullName}
          className="user-card__avatar"
        />
        <div className="user-card__info">
          <h4 className="user-card__name">{user.fullName}</h4>
          <p className="user-card__username">@{user.username}</p>
        </div>
      </div>

      {/* Email */}
      <p className="user-card__email">{user.email}</p>

      {/* Badges */}
      <div className="user-card__badges">
        <span
          className="user-card__badge user-card__badge--role"
          style={{
            backgroundColor: `${getRoleColor(user.role)}20`,
            color: getRoleColor(user.role),
          }}
        >
          {getRoleLabel(user.role)}
        </span>
        <span
          className="user-card__badge user-card__badge--status"
          style={{
            backgroundColor: `${getStatusColor(user.status)}20`,
            color: getStatusColor(user.status),
          }}
        >
          {getStatusLabel(user.status)}
        </span>
      </div>

      {/* Stats */}
      {user.enrolledCourses !== undefined && (
        <p className="user-card__stats">
          Đã đăng ký: <strong>{user.enrolledCourses}</strong> khóa học
        </p>
      )}

      {/* Actions */}
      <div className="user-card__actions">
        {onEdit && (
          <button
            className="user-card__action-btn user-card__action-btn--edit"
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
            className="user-card__action-btn user-card__action-btn--delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(user.userId);
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
