// 🌙 10. useDarkMode

// Chức năng:

// Bật/tắt dark mode.

// Lưu trạng thái vào localStorage để giữ nguyên sau khi reload.

// Tác dụng:

// Triển khai dark mode dễ dàng.

// Gắn class dark cho toàn bộ HTML.
import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

export default function useDarkMode(): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] {
  const [enabled, setEnabled] = useLocalStorage<boolean>("dark-theme", false);

  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [enabled]);

  return [enabled, setEnabled];
}
