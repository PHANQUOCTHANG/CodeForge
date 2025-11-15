import React, { useState } from "react";
import {
  Upload,
  Button,
  Image,
  Progress,
  Spin,
  Alert,
  Space,
  Tooltip,
} from "antd";
import {
  CloudUploadOutlined,
  DeleteOutlined,
  CopyOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import type { RcFile } from "antd/es/upload/interface";
import type { UploadProgress } from "@/api/cloudinaryService";
import cloudinaryService from "@/api/cloudinaryService";
import "./CloudinaryImageUpload.scss";

interface CloudinaryImageUploadProps {
  value?: string;
  onChange?: (imageUrl: string) => void;
  onRemove?: () => void;
  folder?: string;
  maxSize?: number; // MB
  label?: string;
  required?: boolean;
  multiple?: boolean;
}

/**
 * Cloudinary Image Upload Component
 * Handles image uploads with progress tracking and URL management
 *
 * Features:
 * - Single/Multiple image upload
 * - Real-time progress tracking
 * - Image preview
 * - Copy URL to clipboard
 * - File validation
 * - Error handling
 */
const CloudinaryImageUpload: React.FC<CloudinaryImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  folder = "codeforge/courses",
  maxSize = 10, // MB
  label,
  required = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleUpload = async (file: RcFile) => {
    try {
      setUploading(true);
      setUploadError(null);

      // Validate file
      cloudinaryService.validateFile(file, maxSize);

      // Upload to Cloudinary
      const url = await cloudinaryService.uploadImage(
        file,
        (progress: UploadProgress) => {
          setUploadProgress(progress.progress);
          if (progress.status === "error") {
            setUploadError(progress.message);
          }
        },
        folder
      );

      onChange?.(url);
      setUploading(false);
      setUploadProgress(0);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Upload failed";
      setUploadError(errorMsg);
      setUploading(false);
    }

    return false; // Prevent default upload
  };

  const handleCopyUrl = () => {
    if (value) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRemove = () => {
    onChange?.("");
    onRemove?.();
    setUploadError(null);
  };

  return (
    <div className="cloudinary-image-upload">
      {label && (
        <label className="upload-label">
          {label}
          {required && <span className="required-star">*</span>}
        </label>
      )}

      {uploadError && (
        <Alert
          message="Lỗi tải lên"
          description={uploadError}
          type="error"
          closable
          onClose={() => setUploadError(null)}
          style={{ marginBottom: 12 }}
        />
      )}

      {uploading && (
        <div className="upload-progress-container">
          <Spin tip={`Đang tải lên... ${uploadProgress}%`} />
          <Progress
            type="circle"
            percent={uploadProgress}
            width={80}
            strokeColor={
              uploadProgress === 100
                ? "#52c41a"
                : uploadProgress > 50
                ? "#1890ff"
                : "#faad14"
            }
          />
        </div>
      )}

      {!uploading && value && (
        <div className="image-preview-container">
          <div className="image-wrapper">
            <Image
              src={value}
              alt="Uploaded image"
              preview
              style={{
                maxWidth: "100%",
                maxHeight: 300,
                borderRadius: 8,
              }}
            />
          </div>

          <div className="image-info">
            <div className="url-display">
              <code>{value}</code>
              <Tooltip title={copied ? "Đã sao chép!" : "Sao chép URL"}>
                <Button
                  type="text"
                  size="small"
                  icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                  onClick={handleCopyUrl}
                  className={copied ? "copied" : ""}
                />
              </Tooltip>
            </div>

            <Space style={{ marginTop: 12 }}>
              <Upload
                beforeUpload={handleUpload}
                maxCount={1}
                accept="image/*"
                showUploadList={false}
                disabled={uploading}
              >
                <Button
                  type="primary"
                  size="small"
                  icon={<CloudUploadOutlined />}
                  loading={uploading}
                  disabled={uploading}
                >
                  Thay đổi ảnh
                </Button>
              </Upload>

              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={handleRemove}
              >
                Xóa
              </Button>
            </Space>
          </div>
        </div>
      )}

      {!uploading && !value && (
        <div className="upload-area">
          <Upload
            beforeUpload={handleUpload}
            maxCount={1}
            accept="image/*"
            showUploadList={false}
            disabled={uploading}
          >
            <div className="upload-content">
              <CloudUploadOutlined className="upload-icon" />
              <p className="upload-text">Kéo thả ảnh hoặc nhấp để chọn</p>
              <p className="upload-hint">
                Hỗ trợ: JPG, PNG, GIF, WebP (Tối đa {maxSize}MB)
              </p>
            </div>
          </Upload>
        </div>
      )}

      <div className="upload-help">
        <details>
          <summary>ℹ️ Hướng dẫn Cloudinary</summary>
          <div className="help-content">
            <h4>Cách thiết lập Cloudinary:</h4>
            <ol>
              <li>Tạo tài khoản tại https://cloudinary.com</li>
              <li>Vào Settings → Upload → Add upload preset</li>
              <li>Tạo preset tên: "course_images"</li>
              <li>Đặt Signing Mode thành "Unsigned"</li>
              <li>Sao chép Cloud Name vào VITE_CLOUDINARY_CLOUD_NAME</li>
              <li>Sao chép Preset Name vào VITE_CLOUDINARY_UPLOAD_PRESET</li>
              <li>Thêm vào file .env.local hoặc vite.config.ts</li>
            </ol>
            <p>
              <strong>URL sẽ được lưu trực tiếp:</strong> Sau khi upload, URL
              được trả về từ Cloudinary sẽ được gửi lên Backend để lưu vào
              database
            </p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default CloudinaryImageUpload;
