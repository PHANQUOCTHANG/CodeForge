import { useAppSelector } from "@/app/store/store";
/**
 * Hook tùy chỉnh để lấy thông tin người dùng đã xác thực từ Redux Store.
 *
 * Giúp các component UI truy cập dữ liệu người dùng một cách an toàn và nhất quán.
 * * @returns {object} Thông tin người dùng đã chuẩn hóa và trạng thái xác thực.
 */
export const useAuthUser = () => {
  // 1. Lấy state từ Redux Store (giả sử slice auth tên là 'auth')
  // state.auth chứa user object và trạng thái kiểm tra ban đầu (isAuthChecking)
  const { user, isAuthChecking } = useAppSelector((state) => state.auth);

  // 2. Xác định trạng thái xác thực
  // Kiểm tra xem user có tồn tại và có ID hợp lệ không
  const isAuthenticated = !!user && !!user.userId;

  // 3. Trích xuất và chuẩn hóa các trường thông tin cần thiết
  // Sử dụng giá trị mặc định để tránh lỗi undefined trong component
  
  // Lấy ID: Tương ứng với ClaimTypes.NameIdentifier trong JWT/Backend
  const CURRENT_USER_ID = user?.userId || null; 
  
  // Lấy Tên: Thường dùng cho hiển thị trên UI
  const CURRENT_USER_NAME = user?.username || "Khách Vãng Lai";
  
  // Lấy Avatar: Dùng ảnh placeholder nếu không có
  // Lưu ý: Tên field có thể là 'avatarUrl' hoặc 'picture' tùy thuộc vào cấu trúc UserProfile của bạn
  const CURRENT_USER_AVATAR = (user as any)?.avatarUrl || "https://placehold.co/100x100/F4F7F9/888888?text=User"; 

  // 4. Trả về object kết quả
  return {
    // Trạng thái xác thực
    isAuthenticated,
    isAuthChecking,
    
    // Thông tin người dùng đã chuẩn hóa
    CURRENT_USER_ID,
    CURRENT_USER_NAME,
    CURRENT_USER_AVATAR,
    
    // Object user gốc (để truy cập các trường khác như email, role)
    user, 
  };
};