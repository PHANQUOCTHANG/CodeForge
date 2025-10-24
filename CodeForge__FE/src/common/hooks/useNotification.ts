// src/hooks/useNotification.ts

import { notification } from "antd";

// Định nghĩa kiểu cho các tham số và hàm gọi
type NotificationType = "success" | "info" | "warning" | "error";

interface NotificationAPI {
  // Hàm gọi thông báo đơn giản
  notify: (
    type: NotificationType,
    message: string,
    description: string
  ) => void;
  // ContextHolder cần thiết để thông báo hiển thị
  contextHolder: React.ReactElement;
}

export const useNotification = (): NotificationAPI => {
  // 1. Dùng hook của Ant Design để lấy API và ContextHolder
  const [api, contextHolder] = notification.useNotification();

  // 2. Định nghĩa hàm gọi thông báo, sử dụng 'api'
  const notify = (
    type: NotificationType,
    message: string,
    description: string
  ) => {
    // Gọi API của Ant Design
    api[type]({
      message: message,
      description: description,
      placement: "topRight", // Đặt vị trí mặc định
    });
  };

  return {
    notify,
    contextHolder,
  };
};
