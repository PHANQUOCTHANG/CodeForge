import React, { useState, useCallback, useMemo } from "react";
import type {
  UserDto,
  UserFilters,
  CreateUserDto,
  UpdateUserDto,
} from "@/features/user/types";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/features/user/hooks/useUsers";
import { UserTable } from "./UserTable";
import { UserForm } from "./UserForm";
import { UserFilters } from "./UserFilters";
import "./styles/UserList.scss";

/**
 * Main user management page component
 */
export const UserList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<UserFilters>({});
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users
  const { data: usersData, isLoading: isLoadingUsers } = useUsers(
    page,
    pageSize,
    filters.search || searchTerm,
    filters.role,
    filters.status
  );

  // Mutations
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const users = useMemo(() => usersData?.data || [], [usersData]);
  const total = useMemo(() => usersData?.totalCount || 0, [usersData]);
  const totalPages = useMemo(
    () => Math.ceil(total / pageSize),
    [total, pageSize]
  );

  // Handle form submission
  const handleFormSubmit = useCallback(
    (data: CreateUserDto | UpdateUserDto) => {
      if (selectedUser) {
        // Edit mode
        updateUser(
          { id: selectedUser.userId, data: data as UpdateUserDto },
          {
            onSuccess: () => {
              setShowForm(false);
              setSelectedUser(null);
            },
          }
        );
      } else {
        // Create mode
        createUser(data as CreateUserDto, {
          onSuccess: () => {
            setShowForm(false);
            setPage(1);
          },
        });
      }
    },
    [selectedUser, createUser, updateUser]
  );

  // Handle edit user
  const handleEditUser = useCallback((user: UserDto) => {
    setSelectedUser(user);
    setShowForm(true);
  }, []);

  // Handle delete user
  const handleDeleteUser = useCallback(
    (userId: string) => {
      if (confirm("Bạn chắc chắn muốn xóa người dùng này?")) {
        deleteUser(userId);
      }
    },
    [deleteUser]
  );

  // Handle create new user
  const handleCreateNew = useCallback(() => {
    setSelectedUser(null);
    setShowForm(true);
  }, []);

  // Handle close form
  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setSelectedUser(null);
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((newFilters: UserFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page
  }, []);

  // Handle search change
  const handleSearchChange = useCallback((search: string) => {
    setSearchTerm(search);
    setPage(1); // Reset to first page
  }, []);

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const isFormLoading = isCreating || isUpdating;

  return (
    <div className="user-list">
      <div className="user-list__header">
        <div className="user-list__title-section">
          <h1 className="user-list__title">Quản lý người dùng</h1>
          <p className="user-list__subtitle">
            Tổng cộng: <strong>{total}</strong> người dùng
          </p>
        </div>
        {!showForm && (
          <button className="user-list__btn-create" onClick={handleCreateNew}>
            <span className="user-list__btn-icon">+</span>
            Tạo người dùng mới
          </button>
        )}
      </div>

      {showForm ? (
        <div className="user-list__form-section">
          <UserForm
            user={selectedUser}
            isLoading={isFormLoading}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
          />
        </div>
      ) : (
        <>
          <UserFilters
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
          />

          <div className="user-list__table-section">
            <UserTable
              users={users}
              isLoading={isLoadingUsers || isDeleting}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="user-list__pagination">
              <button
                className="user-list__pagination-btn"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || isLoadingUsers}
              >
                ← Trước
              </button>

              <div className="user-list__pagination-info">
                Trang <strong>{page}</strong> / <strong>{totalPages}</strong>
              </div>

              <button
                className="user-list__pagination-btn"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages || isLoadingUsers}
              >
                Tiếp →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserList;
