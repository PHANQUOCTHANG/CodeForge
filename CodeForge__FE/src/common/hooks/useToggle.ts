// 🔘 5. useToggle

// Chức năng:

// Tạo state dạng true/false với 1 hàm toggle.

// Có thể set trực tiếp giá trị.

// Tác dụng:

// Rất tiện cho việc mở/đóng modal, sidebar, dropdown.

// Không phải viết setState(prev => !prev) mỗi lần.
import { useState } from "react";

export default function useToggle(
  initial = false
): [boolean, () => void, React.Dispatch<React.SetStateAction<boolean>>] {
  const [state, setState] = useState<boolean>(initial);
  const toggle = () => setState((prev) => !prev);
  return [state, toggle, setState];
}
