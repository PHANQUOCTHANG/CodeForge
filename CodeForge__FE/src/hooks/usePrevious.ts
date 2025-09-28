// 🔙 8. usePrevious

// Chức năng:

// Lưu giá trị trước đó của một state/prop.

// Tác dụng:

// So sánh giá trị cũ và mới (ví dụ kiểm tra animation).

// Debug hoặc tracking thay đổi dữ liệu.
import { useEffect, useRef } from "react";

export default function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
