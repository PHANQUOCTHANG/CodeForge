import { notification } from "antd";

// 1. ✅ Định nghĩa Union Type cho các loại thông báo hợp lệ của Ant Design
type NotificationType = "success" | "info" | "warning" | "error" | "open";

// 2. ✅ Định nghĩa kiểu cho các tham số và kiểu trả về
export const openNotification = (
  type: NotificationType, // Ràng buộc type chỉ có thể là các giá trị trên
  message: string,
  description: string
): void => {
  // Kiểu trả về là void vì hàm không trả về gì

  // Kiểm tra để đảm bảo kiểu tồn tại trước khi gọi, mặc dù Union Type đã đảm bảo.
  if (notification[type]) {
    notification[type]({
      message: message,
      description: description,
      placement: "topRight",
    });
  } else {
    // Xử lý trường hợp kiểu không xác định (chỉ phòng hờ)
    console.error(`Invalid notification type provided: ${type}`);
  }
};
