// src/features/course/hooks/useEditCourse.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { openNotification } from "@/common/helper/notification";
import { AxiosError } from "axios";
import type { CourseDetail, UpdateCourseDto } from "@/features/course/types"; // 👈 Sử dụng UpdateCourseDto
import type { ApiResponse } from "@/common/types";
import { photoApi } from "@/features/photo-upload/services/photoSevice";
import { courseApi } from "@/features/course/services/courseApi";

/**
 * Dữ liệu đầu vào cho mutation chỉnh sửa:
 * - courseId: ID khóa học cần chỉnh sửa
 * - courseData: JSON của khóa học (đã bao gồm thumbnail MỚI hoặc CŨ)
 * - thumbnailFile: File ảnh mới (nếu có)
 * - originalThumbnailUrl: URL ảnh cũ (dùng để xóa nếu có ảnh mới)
 */
interface EditCourseVariables {
  courseId: string; // ID để gọi API PUT/PATCH
  courseData: UpdateCourseDto; // 👈 Dùng UpdateCourseDto
  thumbnailFile: File | null;
  originalThumbnailUrl?: string | null; // URL ảnh gốc (trước khi edit)
}

/**
 * Hook tùy chỉnh để xử lý logic cập nhật khóa học (bao gồm upload ảnh mới).
 */
export const useEditCourse = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<
    CourseDetail, // Kiểu trả về khi thành công (data của Course)
    AxiosError<ApiResponse<string>>, // Kiểu lỗi
    EditCourseVariables // Kiểu dữ liệu truyền vào hàm mutate
  >({
    mutationFn: async ({
      courseId,
      courseData,
      thumbnailFile,
      originalThumbnailUrl, // URL ảnh gốc (từ lúc fetch data)
    }) => {
      const finalPayload = { ...courseData }; // Khởi tạo payload

      // --- BƯỚC 1: Xử lý Ảnh Bìa ---
      if (thumbnailFile) {
        // TRƯỜNG HỢP 1: Người dùng upload FILE MỚI
        console.log("Đang tải ảnh mới lên Cloudinary...");
        const formData = new FormData();
        formData.append("file", thumbnailFile);
        formData.append("folder", "course_thumbnails");

        try {
          const uploadResponse = await photoApi.uploadImage(formData);
          if (uploadResponse.isSuccess && uploadResponse.data.secureUrl) {
            finalPayload.thumbnail = uploadResponse.data.secureUrl; // Gán link online mới
            console.log("Tải ảnh mới thành công:", finalPayload.thumbnail);

            // (Tùy chọn) Xóa ảnh cũ nếu ảnh cũ tồn tại
            // if (originalThumbnailUrl) {
            //   console.log("Đang xóa ảnh cũ:", originalThumbnailUrl);
            //   await photoApi.deleteImage(originalThumbnailUrl);
            // }
          } else {
            throw new Error(uploadResponse.message || "Tải ảnh mới thất bại.");
          }
        } catch (uploadError) {
          console.error("Lỗi khi tải ảnh:", uploadError);
          throw new Error("Lỗi tải ảnh lên. Không thể cập nhật khóa học.");
        }
      } else if (courseData.thumbnail === null) {
        // TRƯỜNG HỢP 2: Người dùng xóa ảnh (thumbnail là null)
        console.log("Người dùng đã xóa ảnh bìa.");
        finalPayload.thumbnail = null;
        // (Tùy chọn) Xóa ảnh cũ nếu ảnh cũ tồn tại
        // if (originalThumbnailUrl) {
        //   console.log("Đang xóa ảnh cũ:", originalThumbnailUrl);
        //   await photoApi.deleteImage(originalThumbnailUrl);
        // }
      }
      // TRƯỜNG HỢP 3: Người dùng không thay đổi ảnh (thumbnail là string URL cũ)
      // -> finalPayload.thumbnail đã đúng, không cần làm gì

      // --- BƯỚC 2: Cập nhật khóa học với payload cuối cùng ---
      console.log(
        `Đang cập nhật khóa học ID ${courseId} với payload:`,
        finalPayload
      );

      // Sử dụng courseApi.update (thường là PUT/PATCH)
      const courseResponse = await courseApi.update(courseId, finalPayload);

      if (courseResponse.isSuccess) {
        return courseResponse.data;
      } else {
        throw new Error(
          courseResponse.message || "Cập nhật khóa học thất bại."
        );
      }
    },
    onSuccess: (data, variables) => {
      openNotification(
        "success",
        "Thành công",
        "Đã cập nhật khóa học thành công!"
      );

      // Cập nhật cache
      queryClient.invalidateQueries({ queryKey: ["courses"] }); // Danh sách
      queryClient.invalidateQueries({ queryKey: ["course", data.slug] }); // Chi tiết (dùng slug mới)

      console.log("Khóa học đã cập nhật:", data);

      // Chuyển hướng đến trang admin
      navigate(`/admin/courses`);
    },
    onError: (error) => {
      console.error("Lỗi khi cập nhật khóa học:", error);
      openNotification("error", "Thất bại", error.message || "Đã xảy ra lỗi.");
    },
  });
};
