// 🌐 2. useAxios

// Chức năng:

// Hook gọi API bằng axios.

// Tự quản lý loading, error, data.

// Hỗ trợ hủy request khi component bị unmount.

// Tác dụng:

// Viết API call ngắn gọn, không cần try/catch lặp lại.

// Gọi API với axios có loading, error, data sẵn.

// Hủy request khi component unmount (tránh memory leak).

// Có thể mở rộng để auto refresh token.

// Dùng cho fetch user, fetch product list, search API.
// Dùng trong component như:

// const { data, loading, error } = useAxios("/users");
import { useState, useEffect } from "react";
import api from "../api/axios"; // file axios setup

export default function useAxios<T = unknown>(
  url: string,
  options: object = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancel = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get<T>(url, options);
        if (!cancel) setData(res.data);
      } catch (err) {
        if (!cancel) setError(err as Error);
      } finally {
        if (!cancel) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancel = true;
    };
  }, [url, options]);

  return { data, loading, error };
}
