import React, { useState } from "react";
import { Input, Alert, Card } from "antd";
import "./RichTextEditor.scss";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: string;
  label?: string;
  required?: boolean;
}

/**
 * Rich Text Editor Component using Textarea
 * Currently using basic textarea. CKEditor will be added after module resolution fixes.
 *
 * Features:
 * - HTML content editing
 * - Placeholder support
 * - Label and required validation
 */
const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = "",
  onChange,
  placeholder = "Nhập nội dung HTML tại đây...",
  height = "400px",
  label,
  required = false,
}) => {
  const [uploadError, setUploadError] = useState<string | null>(null);

  return (
    <div className="rich-text-editor-container">
      {label && (
        <label className="editor-label">
          {label}
          {required && <span className="required-star">*</span>}
        </label>
      )}

      {uploadError && (
        <Alert
          message="Lỗi"
          description={uploadError}
          type="error"
          closable
          onClose={() => setUploadError(null)}
          style={{ marginBottom: 12 }}
        />
      )}

      <Card
        style={{
          padding: 0,
          overflow: "hidden",
          borderRadius: 6,
        }}
      >
        <Input.TextArea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          style={{
            height,
            fontFamily: "monospace",
            fontSize: "14px",
            minHeight: 300,
            border: "none",
            outline: "none",
          }}
          className="editor-textarea"
        />
      </Card>

      <div className="editor-info">
        <small>
          Hỗ chiệu: HTML content. Sau khi lưu, hình ảnh upload có thể được thêm
          vào bằng tag img.
        </small>
      </div>

      {/* Info box about using Cloudinary for images */}
      <div className="upload-help" style={{ marginTop: 16 }}>
        <details>
          <summary>ℹ️ Cách thêm hình ảnh từ Cloudinary</summary>
          <div
            className="help-content"
            style={{
              padding: "12px",
              background: "#f5f5f5",
              borderRadius: 4,
              marginTop: 8,
            }}
          >
            <p>Bạn có thể thêm hình ảnh bằng cách:</p>
            <ol>
              <li>Upload ảnh bằng component CloudinaryImageUpload</li>
              <li>Sao chép URL được trả về</li>
              <li>
                Dán vào editor với định dạng: &lt;img src="URL"
                alt="description" /&gt;
              </li>
            </ol>
            <p>
              <strong>Ví dụ:</strong>
            </p>
            <code
              style={{
                display: "block",
                background: "white",
                padding: "8px",
                borderRadius: 4,
                marginTop: 8,
              }}
            >
              &lt;h2&gt;Tiêu đề&lt;/h2&gt;
              <br />
              &lt;p&gt;Nội dung&lt;/p&gt;
              <br />
              &lt;img src="https://res.cloudinary.com/..." alt="Mô tả" /&gt;
            </code>
          </div>
        </details>
      </div>
    </div>
  );
};

export default RichTextEditor;
