import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import authApi from "@/features/auth/services/authApi";
import { setGlobalAccessToken, setGlobalDispatch } from "@/api/axios";
import { openNotification } from "@/common/helper/notification";
import { authCheckFinished, login } from "@/features/auth/slices/authSlice";

/**
 * Hook để khởi tạo authentication khi app load
 * - Setup dispatch cho axios interceptors
 * - Kiểm tra và restore session nếu có refresh token
 * - Sync access token từ Redux vào axios instance
 */
export const useInitAuth = () => {
  const dispatch = useAppDispatch();
  const initRef = useRef(false);
  const { token } = useAppSelector((state) => state.auth);

  // ============================================================================
  // EFFECT 1: Setup Dispatch (Chạy 1 lần duy nhất)
  // ============================================================================
  useEffect(() => {
    setGlobalDispatch(dispatch);
    console.log("🔧 Axios interceptor dispatch đã được khởi tạo");
  }, [dispatch]);

  // ============================================================================
  // EFFECT 2: Sync Access Token (Chạy mỗi khi token thay đổi)
  // ============================================================================
  useEffect(() => {
    setGlobalAccessToken(token);

    if (token) {
      console.log("🔑 Access token đã được sync vào axios");
    } else {
      console.log("🔓 Access token đã được xóa khỏi axios");
    }
  }, [token]);

  // ============================================================================
  // EFFECT 3: Init Auth Check (Chạy 1 lần duy nhất khi mount)
  // ============================================================================
  useEffect(() => {
    // 🚫 CRITICAL: Prevent double execution
    if (initRef.current) return;
    initRef.current = true;

    const initAuth = async () => {
      console.log("🚀 Bắt đầu kiểm tra authentication...");

      try {
        // -----------------------------------------------------------------------
        // CASE 1: Đã có token trong Redux (user đã login trước đó)
        // -----------------------------------------------------------------------
        if (token) {
          console.log("✅ Đã có token trong Redux, skip refresh");
          dispatch(authCheckFinished());
          return;
        }

        // -----------------------------------------------------------------------
        // CASE 2: Chưa có token, thử refresh từ httpOnly cookie
        // -----------------------------------------------------------------------
        console.log("🔄 Thử refresh token từ cookie...");

        const res = await authApi.refreshAuth();
        const { accessToken, userInfo } = res.data;

        // Cập nhật Redux state
        dispatch(
          login({
            accessToken: accessToken,
            userInfor: userInfo,
          })
        );

        console.log(userInfo);
      } catch (error: any) {
        // -----------------------------------------------------------------------
        // Error Handling - QUAN TRỌNG: Không xử lý 401/403 ở đây
        // -----------------------------------------------------------------------
        console.log("⚠️ Refresh token thất bại hoặc không tồn tại");

        // 🎯 LƯU Ý: KHÔNG nên xử lý 401/403 ở đây vì:
        // 1. Axios interceptor đã xử lý logout/redirect rồi
        // 2. Xử lý ở đây sẽ gây duplicate notification
        // 3. Race condition giữa interceptor và code này

        if (error.response) {
          const status = error.response.status;

          // Chỉ log, KHÔNG logout/redirect/notification
          if (status === 401 || status === 403) {
            console.log("ℹ️ Không có session hợp lệ, user cần đăng nhập");
            // Axios interceptor sẽ xử lý việc redirect nếu cần
          } else {
            // Các lỗi khác (500, 502, etc.)
            console.error(
              "❌ Server error:",
              status,
              error.response.data?.message
            );
          }
        } else if (error.request) {
          // Lỗi mạng
          console.error("❌ Không thể kết nối tới server:", error.message);

          // Optional: Hiển thị notification cho lỗi mạng
          openNotification(
            "warning",
            "Lỗi kết nối",
            "Không thể kết nối đến server. Vui lòng kiểm tra mạng của bạn."
          );
        } else {
          // Lỗi không xác định
          console.error("❌ Lỗi không xác định:", error.message);
        }
      } finally {
        // Đánh dấu đã hoàn thành việc check auth
        dispatch(authCheckFinished());
        console.log("🏁 Auth check hoàn tất");
      }
    };

    initAuth();

    // ⚠️ CRITICAL: Dependencies array phải rỗng để chỉ chạy 1 lần
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 🚨 Chỉ chạy khi component mount

  // Hook này không return gì vì chỉ làm side effects
  return null;
};
