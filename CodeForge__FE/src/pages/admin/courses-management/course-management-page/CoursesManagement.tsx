// CoursesManagement.tsx (Phiên bản React Query & UI cải tiến)

import React, { useState } from "react";
import {
  Button,
  Modal,
  Input,
  Select,
  Popconfirm,
  message,
  Pagination,
  Spin,
  Card,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  BookOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import "./CoursesManagement.scss";

// Giả định: useCourses được định nghĩa ở đây hoặc file khác
import { useCourses } from "@/features";
import type { Course } from "@/features/course/types";
import { useNavigate } from "react-router-dom";

// Định nghĩa Page Size (nên dùng const chung hoặc lấy từ API)
const pageSize = 8;

const CoursesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [level, setLevel] = useState("all");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  // 🚀 LẤY DỮ LIỆU TỪ REACT QUERY
  const {
    data,
    isLoading,
    isError,
    refetch, // Dùng refetch để tải lại sau khi xóa/sửa
  } = useCourses(
    page,
    pageSize,
    searchTerm,
    level === "all" ? "" : level, // Chuyển 'all' thành chuỗi rỗng cho API
    "all" // Lấy tất cả trạng thái (active/draft) cho Admin
  );

  const courses: Course[] = data?.data || [];
  const totalItems = data?.totalItems || 0;
  console.log("📚 Khóa học tải về:", courses);
  // --- Logic Xử lý Actions ---

  const handleDelete = async (courseId: string) => {
    try {
      // Thay thế axios.delete bằng hook mutation (useDeleteCourse)
      // await deleteMutation.mutateAsync(courseId);

      // Giả lập thành công:
      message.success("Xóa khóa học thành công (giả lập)");

      refetch(); // Tải lại danh sách sau khi xóa
      setPage(1);
    } catch (err) {
      message.error("Lỗi khi xóa khóa học");
      console.error(err);
    }
  };

  // --- Cải tiến Card UI ---
  const renderCourseCard = (course: Course) => (
    <Card
      className="course-card-admin"
      key={course.courseId}
      hoverable
      title={<div className="course-card-admin__title">{course.title}</div>}
      extra={
        <Tag color={course.status === "active" ? "green" : "orange"}>
          {course.status ? course.status.toUpperCase() : "DRAFT"}
        </Tag>
      }
    >
      <div className="course-card-admin__content">
        <p className="course-card-admin__desc">
          {course.description || "Không có mô tả"}
        </p>
        <div className="course-card-admin__meta">
          <Tag icon={<BookOutlined />} color="blue">
            {course.level}
          </Tag>
          {course.language && <Tag color="geekblue">{course.language}</Tag>}
          <Tag icon={<RiseOutlined />} color="volcano">
            {course.slug}
          </Tag>
        </div>
      </div>
      <div className="course-card-admin__actions-footer">
        <Button
          type="primary"
          ghost
          size="small"
          icon={<EyeOutlined />}
          title="Xem chi tiết"
          style={{ marginRight: 8 }}
        />
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/admin/courses/edit/${course.courseId}`);
          }}
          title="Sửa"
          style={{ marginRight: 8 }}
        />
        <Popconfirm
          title="Xác nhận xóa khóa học này?"
          description="Hành động này không thể hoàn tác"
          onConfirm={() => handleDelete(course.courseId)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button danger size="small" icon={<DeleteOutlined />} title="Xóa" />
        </Popconfirm>
      </div>
    </Card>
  );

  // --- JSX Chính ---
  return (
    <div className="courses-management-container">
      <div className="courses-management-header">
        <h1>Quản lý khóa học</h1>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => {
            navigate("/admin/courses/new");
          }}
        >
          Thêm khóa học
        </Button>
      </div>

      <div className="courses-management-filters">
        <Input.Search
          placeholder="Tìm kiếm khóa học..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          style={{ width: 260 }}
          allowClear
        />
        <Select
          value={level}
          onChange={(v) => {
            setLevel(v);
            setPage(1);
          }}
          style={{ width: 180 }}
        >
          <Select.Option value="all">Tất cả trình độ</Select.Option>
          <Select.Option value="beginner">Beginner</Select.Option>
          <Select.Option value="intermediate">Intermediate</Select.Option>
          <Select.Option value="advanced">Advanced</Select.Option>
        </Select>
      </div>

      <Spin spinning={isLoading}>
        <div className="courses-management-grid">
          {isError && (
            <div className="error">Lỗi khi tải dữ liệu. Vui lòng thử lại.</div>
          )}
          {courses.length > 0 ? (
            courses.map(renderCourseCard)
          ) : (
            <div
              className="empty"
              style={{
                padding: "50px",
                gridColumn: "1 / -1",
                textAlign: "center",
              }}
            >
              {isLoading
                ? "Đang tải..."
                : "Không có khóa học nào khớp với tiêu chí tìm kiếm."}
            </div>
          )}
        </div>
      </Spin>

      <div className="courses-management-pagination">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={totalItems}
          onChange={setPage}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default CoursesManagement;
