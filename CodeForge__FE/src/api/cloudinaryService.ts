/**
 * Cloudinary Upload Service
 * Handles all image uploads to Cloudinary
 *
 * Environment Variables Required:
 * - VITE_CLOUDINARY_CLOUD_NAME: Your Cloudinary cloud name
 * - VITE_CLOUDINARY_UPLOAD_PRESET: Your Cloudinary upload preset
 *
 * Setup Instructions:
 * 1. Create account at https://cloudinary.com
 * 2. Go to Settings > Upload > Add upload preset
 * 3. Create preset with name: "course_images" (or your custom name)
 * 4. Set "Signing Mode" to Unsigned
 * 5. Copy Cloud Name and Preset name
 * 6. Add to .env.local or vite.config.ts
 */

const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dvglj9xjb";
const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "course_images";
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export interface UploadProgress {
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  message: string;
}

export interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  url: string;
  original_filename: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  resource_type: string;
  created_at: string;
}

class CloudinaryService {
  /**
   * Upload image to Cloudinary
   * @param file - File to upload
   * @param onProgress - Progress callback
   * @param folder - Cloudinary folder path (optional)
   * @returns Promise with secure URL
   */
  async uploadImage(
    file: File,
    onProgress?: (progress: UploadProgress) => void,
    folder: string = "codeforge/courses"
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);
      formData.append("folder", folder);

      const xhr = new XMLHttpRequest();

      // Progress tracking
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          onProgress?.({
            progress: percentComplete,
            status: "uploading",
            message: `Đang tải lên... ${percentComplete}%`,
          });
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const response: CloudinaryResponse = JSON.parse(xhr.responseText);
            onProgress?.({
              progress: 100,
              status: "success",
              message: "Tải lên thành công",
            });
            resolve(response.secure_url);
          } catch {
            onProgress?.({
              progress: 0,
              status: "error",
              message: "Lỗi phân tích phản hồi",
            });
            reject(new Error("Invalid response format"));
          }
        } else {
          const errorMsg = xhr.statusText || "Upload failed";
          onProgress?.({
            progress: 0,
            status: "error",
            message: `Lỗi: ${errorMsg}`,
          });
          reject(new Error(errorMsg));
        }
      };

      xhr.onerror = () => {
        onProgress?.({
          progress: 0,
          status: "error",
          message: "Kết nối bị lỗi",
        });
        reject(new Error("Network error"));
      };

      xhr.onabort = () => {
        onProgress?.({
          progress: 0,
          status: "error",
          message: "Hủy tải lên",
        });
        reject(new Error("Upload cancelled"));
      };

      xhr.open("POST", CLOUDINARY_API_URL);
      xhr.send(formData);
    });
  }

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(
    files: File[],
    onProgress?: (fileIndex: number, progress: UploadProgress) => void,
    folder?: string
  ): Promise<string[]> {
    const results: string[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const url = await this.uploadImage(
          files[i],
          (progress) => onProgress?.(i, progress),
          folder
        );
        results.push(url);
      } catch (error) {
        console.error(`Failed to upload file ${i}:`, error);
        results.push(""); // Add empty string for failed uploads
      }
    }

    return results.filter((url) => url !== "");
  }

  /**
   * Get CloudinaryService configuration info
   */
  getConfig() {
    return {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      apiUrl: CLOUDINARY_API_URL,
      isConfigured: !!CLOUDINARY_CLOUD_NAME && !!CLOUDINARY_UPLOAD_PRESET,
    };
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      throw new Error(
        `File size exceeds ${maxSizeMB}MB limit. Current size: ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
    }

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Invalid file type. Allowed: JPG, PNG, GIF, WebP");
    }

    return true;
  }
}

export default new CloudinaryService();
