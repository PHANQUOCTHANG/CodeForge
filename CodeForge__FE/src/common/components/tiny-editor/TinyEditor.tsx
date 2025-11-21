import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";

// Props khớp với Ant Design Form
interface TextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  height?: number;
  placeholder?: string; // Thêm placeholder cho chuyên nghiệp
  disabled?: boolean; // Thêm disabled để hỗ trợ trạng thái xem/khóa
}

// Lưu ý: Nên đưa API Key vào biến môi trường (.env)
// const tinymceAPIKey = import.meta.env.VITE_TINYMCE_API_KEY;
const tinymceAPIKey = "nlwtznl6lqtn313xvvuj2nkizvpffe3xcab224tu537e2j2q";

export default function TextEditor({
  value = "",
  onChange,
  height = 500,
  placeholder,
  disabled = false,
}: TextEditorProps) {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [internalValue, setInternalValue] = useState(value);

  // Đồng bộ dữ liệu từ Form vào Editor (Khi Load/Reset)
  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
      if (editorRef.current && editorRef.current.getContent() !== value) {
        editorRef.current.setContent(value || "");
      }
    }
  }, [value]);

  // Xử lý khi Admin gõ nội dung
  const handleEditorChange = (newContent: string, editor: TinyMCEEditor) => {
    setInternalValue(newContent);
    if (onChange && newContent !== value) {
      onChange(newContent);
    }
  };

  return (
    <>
      <Editor
        apiKey={tinymceAPIKey}
        onInit={(_evt, editor) => (editorRef.current = editor)}
        value={internalValue}
        onEditorChange={handleEditorChange}
        disabled={disabled}
        init={{
          height: height,
          menubar: true, // Giữ menu bar để truy cập các tính năng nâng cao
          placeholder: placeholder,

          // 1. BỘ PLUGINS ĐẦY ĐỦ CHO ADMIN
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
            "codesample", // 👈 QUAN TRỌNG: Plugin chèn code snippet
            "directionality",
          ],

          // 2. TOOLBAR TỐI ƯU (Sắp xếp theo nhóm)
          toolbar:
            // Nhóm 1: Hoàn tác & Kiểu chữ
            "undo redo | blocks | " +
            "bold italic underline strikethrough forecolor backcolor | " +
            // Nhóm 2: Căn chỉnh & Danh sách
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | " +
            // Nhóm 3: Chèn đối tượng (Link, Ảnh, Video, Code, Bảng)
            "link image media table codesample | " +
            // Nhóm 4: Công cụ (Xem trước, Code nguồn, Fullscreen)
            "preview code fullscreen",

          // 3. CẤU HÌNH DANH SÁCH NGÔN NGỮ CHO 'codesample'
          codesample_languages: [
            { text: "HTML/XML", value: "markup" },
            { text: "JavaScript", value: "javascript" },
            { text: "TypeScript", value: "typescript" },
            { text: "CSS", value: "css" },
            { text: "C#", value: "csharp" },
            { text: "Java", value: "java" },
            { text: "Python", value: "python" },
            { text: "C++", value: "cpp" },
            { text: "SQL", value: "sql" },
            { text: "JSON", value: "json" },
            { text: "Bash/Shell", value: "bash" },
          ],

          // 4. CSS CHO NỘI DUNG BÊN TRONG EDITOR (Giống giao diện người học)
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
              font-size: 16px; 
              line-height: 1.6; 
              color: #333;
              padding: 10px;
            }
            img { max-width: 100%; height: auto; border-radius: 4px; }
            pre { 
              background: #f4f4f4; 
              padding: 15px; 
              border-radius: 6px; 
              border: 1px solid #ddd; 
              font-family: 'Fira Code', monospace;
            }
            code { color: #c7254e; background-color: #f9f2f4; padding: 2px 4px; border-radius: 4px; }
            blockquote { border-left: 4px solid #ccc; margin-left: 0; padding-left: 15px; color: #666; }
            table { border-collapse: collapse; width: 100%; }
            table td, table th { border: 1px solid #ddd; padding: 8px; }
            table tr:nth-child(even){background-color: #f2f2f2;}
            table th { padding-top: 12px; padding-bottom: 12px; text-align: left; background-color: #04AA6D; color: white; }
          `,

          // Tùy chọn khác
          image_caption: true, // Cho phép thêm chú thích ảnh
          default_link_target: "_blank", // Link mặc định mở tab mới
        }}
      />
      {/* CSS Hack để ẩn thông báo nâng cấp của TinyMCE (nếu dùng bản free) */}
      <style>{`.tox-notification--in { display: none !important; }`}</style>
    </>
  );
}
