// 💾 4. useLocalStorage

// Chức năng:

// Quản lý state nhưng đồng thời lưu vào localStorage.

// Dữ liệu không bị mất khi refresh page.

// Tác dụng:

// Lưu theme, token, cài đặt người dùng.

// Ví dụ:

// const [theme, setTheme] = useLocalStorage("theme", "light");
import { useState, useEffect } from "react";

export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
