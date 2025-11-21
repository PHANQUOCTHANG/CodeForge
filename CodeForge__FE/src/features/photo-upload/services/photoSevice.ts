// src/features/photo-upload/services/photoApi.ts (hoặc photoSevice.ts)

import api from "@/api/axios"; // Import instance Axios của bạn
import type { ApiResponse } from "@/common/types";
import type { PhotoUploadDto } from "@/features/photo-upload/types";
import type { AxiosRequestConfig } from "axios"; // 👈 1. Import AxiosRequestConfig

export const photoApi = {
  /**
   * Tải một file ảnh lên server.
   * @param formData - Đối tượng FormData chứa 'file' và 'folder'.
   * @returns Promise chứa thông tin ảnh đã upload.
   */
  uploadImage: (formData: FormData): Promise<ApiResponse<PhotoUploadDto>> => {
    // 👈 2. Tạo config để ghi đè header
    const config: AxiosRequestConfig = {
      headers: {
        // 'Content-Type': null, // Cách 1: Để Axios tự quyết định (khuyên dùng)
        "Content-Type": "multipart/form-data", // Cách 2: Ghi đè rõ ràng
      },
    };

    // 👈 3. Truyền 'config' làm đối số thứ ba
    return api.post("/upload/image", formData, config).then((res) => res.data);
  },
};
