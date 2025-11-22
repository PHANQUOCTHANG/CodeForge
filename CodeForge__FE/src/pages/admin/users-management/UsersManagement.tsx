import React from "react";
import { UserList } from "@/features/user/components";
import "./Users.scss";

/**
 * Admin Users Management Page
 * Wrapper component for the user management feature
 */
const UsersManagement: React.FC = () => {
  return (
    <div className="users-management-page">
      <UserList />
    </div>
  );
};

export default UsersManagement;
