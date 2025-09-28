// 📏 6. useWindowSize

// Chức năng:

// Theo dõi kích thước cửa sổ trình duyệt (width, height).

// Tác dụng:

// Dùng trong responsive design.

// Ví dụ: Hiện sidebar nếu width > 1024px, ẩn nếu nhỏ hơn.
import { useState, useEffect } from "react";

export default function useWindowSize() {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}
