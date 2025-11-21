// src/utils/sanitizeHtml.ts (Sử dụng dompurify)
import DOMPurify from "dompurify";

// Lưu ý: Trong môi trường React/Vite, bạn có thể cần thiết lập JSDOM
// hoặc dùng phiên bản client-side thuần túy tùy thuộc vào cách bạn import DOMPurify.
// Nếu bạn chỉ import DOMPurify, nó sẽ hoạt động trên trình duyệt.
export const sanitizeHtml = (dirtyHtml: string | undefined): string => {
  if (!dirtyHtml) return "";
  // DOMPurify.sanitize loại bỏ các thẻ script và các thuộc tính/tag độc hại khác.
  return DOMPurify.sanitize(dirtyHtml);
};
// Đảm bảo bạn import hàm này vào CreateCourseEditor.tsx
