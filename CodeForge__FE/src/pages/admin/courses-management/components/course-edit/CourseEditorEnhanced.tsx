import React from "react";
import { useParams } from "react-router-dom";
import { Spin, Result, Button } from "antd";
import { AxiosError } from "axios";
import NotFound from "@/pages/not-found/NotFound";
import CourseEditor from "@/pages/admin/courses-management/components/edit-model/EditCourse";
import { useCourseAdminDetail } from "@/features/course/hooks/useCourseAdminDetail";

const EditCourseEditor: React.FC = () => {
  // 1. Lấy slug từ URL (ví dụ: 'lap-trinh-c-nang-cao')
  const { courseId } = useParams<{ courseId: string }>();

  // 2. Gọi API để lấy dữ liệu chi tiết khóa học
  const {
    data: courseData, // Dữ liệu khóa học chi tiết (CourseDetail)
    isLoading,
    isError,
    error,
  } = useCourseAdminDetail(courseId); // Hook này trả về CourseDetail đã select
  console.log("🔍 Chi tiết khóa học:", courseData, courseId);
  // 3. Xử lý trạng thái Loading
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          flexDirection: "column",
        }}
      >
        <Spin size="large" />
        <p style={{ marginTop: "20px" }}>Đang tải dữ liệu khóa học...</p>
      </div>
    );
  }

  // 4. Xử lý lỗi 404 (Không tìm thấy khóa học)
  const axiosError = error as AxiosError;
  if (isError && axiosError?.response?.status === 404) {
    return <NotFound />; // 👈 Render trang 404
  }

  // 5. Xử lý các lỗi khác (500, 403, ...)
  if (isError) {
    return (
      <Result
        status="error"
        title="Lỗi tải dữ liệu"
        subTitle={
          axiosError?.response?.data?.message ||
          error?.message ||
          "Đã có lỗi xảy ra."
        }
        extra={
          <Button type="primary" onClick={() => window.location.reload()}>
            Tải lại trang
          </Button>
        }
      />
    );
  }

  // 6. Nếu thành công, render Form chung ở chế độ EDIT
  return (
    <CourseEditor
      isEditMode={true} // 👈 Báo cho Form biết đây là chế độ Edit
      initialData={courseData} // 👈 Truyền dữ liệu chi tiết vào Form
    />
  );
};

export default EditCourseEditor;
