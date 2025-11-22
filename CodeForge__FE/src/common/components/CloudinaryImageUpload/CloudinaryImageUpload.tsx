// src/common/components/CloudinaryImageUpload/CloudinaryImageUpload.tsx
import React, { useState, useEffect } from "react";
import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd";

// Props này sẽ được Ant Design Form tự động truyền vào
interface CustomImageUploadProps {
  value?: File | string | null; // Giá trị từ Form (có thể là File mới hoặc string URL cũ)
  onChange?: (fileOrUrl: File | string | null) => void; // Hàm callback để cập nhật Form
}

const CloudinaryImageUpload: React.FC<CustomImageUploadProps> = ({
  value,
  onChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // 1. Sử dụng useEffect để cập nhật previewUrl khi 'value' (từ Form) thay đổi
  useEffect(() => {
    let newPreviewUrl = "";
    let objectUrlToRevoke: string | null = null;

    if (typeof value === "string") {
      // Nếu value là string, đây là URL ảnh cũ (từ database)
      newPreviewUrl = value;
    } else if (value instanceof File) {
      // Nếu value là File, đây là ảnh mới, tạo URL tạm thời để preview
      newPreviewUrl = URL.createObjectURL(value);
      objectUrlToRevoke = newPreviewUrl; // Đánh dấu để thu hồi sau
    }

    setPreviewUrl(newPreviewUrl);

    // 2. Thu hồi (Revoke) URL tạm thời cũ để tránh rò rỉ bộ nhớ
    return () => {
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
    };
  }, [value]); // Chỉ chạy lại khi 'value' thay đổi

  // 3. Xử lý khi người dùng thêm/xóa ảnh
  const handleChange: UploadProps["onChange"] = (info) => {
    const file = info.file as UploadFile;

    if (file.status === "uploading") {
      setLoading(true);
      return; // Chờ đến khi 'done'
    }

    if (file.status === "done") {
      // 'done' được kích hoạt bởi customRequest
      const selectedFile = file.originFileObj as File;
      onChange?.(selectedFile); // 👈 Gọi hàm onChange của Form với File object
      setLoading(false);
    } else if (file.status === "removed") {
      onChange?.(null); // 👈 Gọi hàm onChange của Form với null
      setLoading(false);
    } else if (file.status === "error") {
      message.error(`${file.name} tải file thất bại.`);
      onChange?.(null); // Đặt giá trị là null nếu lỗi
      setLoading(false);
    }
  };

  // Nút upload
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  return (
    <Upload
      name="file"
      listType="picture-card"
      maxCount={1}
      showUploadList={false} // Tắt danh sách file mặc định
      // Giả lập việc upload (vì chúng ta chỉ lấy File object)
      customRequest={({ onSuccess }) => setTimeout(() => onSuccess?.("ok"), 0)}
      onChange={handleChange}
      beforeUpload={(file) => {
        const isImg = ["image/png", "image/jpeg", "image/webp"].includes(
          file.type
        );
        if (!isImg) message.error("Chỉ hỗ trợ JPG/PNG/WEBP!");

        const isLt5M = file.size / 1024 / 1024 < 5; // Giới hạn 5MB
        if (!isLt5M) message.error("Ảnh phải nhỏ hơn 5MB!");

        return (isImg && isLt5M) || Upload.LIST_IGNORE;
      }}
    >
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="thumbnail"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

export default CloudinaryImageUpload;
