// 🌐 2. useAxios

// Chức năng:

// Hook gọi API bằng axios.

// Tự quản lý loading, error, data.

// Hỗ trợ hủy request khi component bị unmount.

// Tác dụng:

// Viết API call ngắn gọn, không cần try/catch lặp lại.

// Dùng trong component như:

// const { data, loading, error } = useAxios("/users");
import { useState, useEffect } from "react";

export default function useAuth() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem("access_token", token);
    } else {
      localStorage.removeItem("access_token");
    }
  }, [token]);

  const logout = () => setToken(null);

  return { token, setToken, isLoggedIn: !!token, logout };
}
