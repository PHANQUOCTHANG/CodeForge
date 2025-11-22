// src/features/course/hooks/useCreateCourse.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { openNotification } from "@/common/helper/notification"; // Adjust path

import { AxiosError } from "axios";
import type { CourseDetail, CreateCourseDto } from "@/features/course/types";
import type { ApiResponse } from "@/common/types";
import { photoApi } from "@/features/photo-upload/services/photoSevice";
import { courseApi } from "@/features/course/services/courseApi";

/**
 * Dữ liệu đầu vào cho mutation:
 * - courseData: JSON của khóa học (trừ thumbnail)
 * - thumbnailFile: File ảnh (nếu có)
 */
interface CreateCourseVariables {
  courseData: Omit<CreateCourseDto, "thumbnail">; // Bỏ trường thumbnail
  thumbnailFile: File | null;
}

/**
 * Hook tùy chỉnh để xử lý logic tạo khóa học (bao gồm upload ảnh).
 */
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  //   const navigate = useNavigate();

  return useMutation<
    CourseDetail, // Kiểu trả về khi thành công (data của Course)
    AxiosError<ApiResponse<string>>, // Kiểu lỗi
    CreateCourseVariables // Kiểu dữ liệu truyền vào hàm mutate
  >({
    mutationFn: async ({ courseData, thumbnailFile }) => {
      let imageUrl: string | undefined = undefined;

      // --- BƯỚC 1: Tải ảnh lên (nếu có) ---
      if (thumbnailFile) {
        console.log("Đang tải ảnh lên...");
        const formData = new FormData();
        formData.append("file", thumbnailFile);
        formData.append("folder", "course_thumbnails"); // Chỉ định thư mục trên Cloudinary

        try {
          const uploadResponse = await photoApi.uploadImage(formData);
          if (uploadResponse.isSuccess && uploadResponse.data.secureUrl) {
            imageUrl = uploadResponse.data.secureUrl; // Lấy link online
            console.log("Tải ảnh thành công:", imageUrl);
          } else {
            throw new Error(uploadResponse.message || "Tải ảnh thất bại.");
          }
        } catch (uploadError) {
          console.error("Lỗi khi tải ảnh:", uploadError);
          // Ném lỗi để useMutation bắt được và đưa vào onError
          throw new Error("Lỗi tải ảnh lên. Không thể tạo khóa học.");
        }
      }

      // --- BƯỚC 2: Tạo khóa học với link ảnh (hoặc undefined) ---
      const finalPayload: CreateCourseDto = {
        ...courseData,
        thumbnail: imageUrl, // Gán link online vào payload
      };

      console.log("Đang tạo khóa học với payload:", finalPayload);
      const courseResponse = await courseApi.create(finalPayload);
      if (courseResponse.isSuccess) {
        return courseResponse.data; // Trả về data của khóa học
      } else {
        throw new Error(courseResponse.message || "Tạo khóa học thất bại.");
      }
    },
    onSuccess: (data) => {
      // Khi cả 2 bước thành công
      openNotification("success", "Thành công", "Đã tạo khóa học thành công!");

      // Xóa cache của danh sách khóa học để fetch lại
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      console.log("Khóa học đã tạo:", data);
      // Chuyển hướng đến trang quản lý hoặc trang chi tiết khóa học mới
      //   navigate(`/admin/courses/${data.slug}`); // Hoặc /courses/
    },
    onError: (error) => {
      // Khi BƯỚC 1 hoặc BƯỚC 2 thất bại
      console.error("Lỗi khi tạo khóa học:", error);
      openNotification("error", "Thất bại", error.message || "Đã xảy ra lỗi.");
    },
  });
};
