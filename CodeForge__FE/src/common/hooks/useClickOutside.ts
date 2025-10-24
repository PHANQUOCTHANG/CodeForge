// 🖱️ 7. useClickOutside

// Chức năng:

// Bắt sự kiện click ra ngoài một element.

// Tác dụng:

// Đóng dropdown, modal khi click ra ngoài.

// Giúp UI giống app chuyên nghiệp.
import { useEffect } from "react";

export default function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, callback]);
}
