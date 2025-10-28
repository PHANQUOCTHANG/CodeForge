// ⏳ 3. useDebounce

// Chức năng:

// Trả về một giá trị bị delay sau một khoảng thời gian.

// Ví dụ nhập chữ trong ô tìm kiếm, chỉ gọi API khi người dùng ngừng gõ 500ms.

// Tác dụng:

// Giảm số lần gọi API → tăng hiệu năng.

// Thường dùng cho search bar, auto complete.
import { useState, useEffect } from "react";

export default function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}
