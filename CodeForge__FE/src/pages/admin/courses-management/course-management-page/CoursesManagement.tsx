// CoursesManagement.tsx (Phiên bản cải tiến với UI/UX đẹp hơn)

import React, { useState } from "react";
import {
  Button,
  Input,
  Select,
  Popconfirm,
  message,
  Pagination,
  Spin,
  Tag,
  Rate,
  Switch,
  Empty,
  Skeleton,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  FileTextOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import "./CoursesManagement.scss";

import { useCourses } from "@/features";
import type { Course } from "@/features/course/types";
import { useNavigate } from "react-router-dom";

const pageSize = 12;

const CoursesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [level, setLevel] = useState("all");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  // 🚀 LẤY DỮ LIỆU TỪ REACT QUERY
  const { data, isLoading, isError, refetch } = useCourses(
    page,
    pageSize,
    searchTerm,
    level === "all" ? "" : level,
    "all" // Lấy tất cả trạng thái (active/draft) cho Admin
  );

  const courses: Course[] = data?.data || [];
  const totalItems = data?.totalItems || 0;

  const handleDelete = async (courseId: string) => {
    try {
      // Thay thế bằng hook mutation thực tế
      message.success("Xóa khóa học thành công (giả lập)");
      refetch();
      setPage(1);
    } catch (err) {
      message.error("Lỗi khi xóa khóa học");
      console.error(err);
    }
  };

  const handleStatusChange = async (courseId: string, newStatus: boolean) => {
    try {
      // Thay thế bằng hook mutation thực tế
      const statusText = newStatus ? "active" : "draft";
      message.success(`Cập nhật trạng thái thành ${statusText} (giả lập)`);
      refetch();
    } catch (err) {
      message.error("Lỗi khi cập nhật trạng thái");
      console.error(err);
    }
  };

  // --- Render Course Card (Cải tiến) ---
  const renderCourseCard = (course: Course) => {
    const isActive = course.status === "active";
    const discountedPrice =
      course.price - (course.price * course.discount) / 100;

    return (
      <div key={course.courseId} className="admin-course-card">
        {/* Thumbnail Section */}
        <div className="admin-course-card__thumbnail-wrapper">
          <img
            src={
              course.thumbnail ||
              "https://via.placeholder.com/300x200?text=No+Image"
            }
            alt={course.title}
            className="admin-course-card__thumbnail"
          />
          <div className="admin-course-card__overlay">
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/courses/${course.slug}`)}
              className="admin-course-card__btn-view"
            />
          </div>
          {course.discount > 0 && (
            <div className="admin-course-card__discount-badge">
              -{course.discount}%
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="admin-course-card__content">
          {/* Header with Status */}
          <div className="admin-course-card__header">
            <Tag color={isActive ? "green" : "orange"}>
              {isActive ? "Active" : "Draft"}
            </Tag>
            <Tag color="blue">{course.level.toUpperCase()}</Tag>
          </div>

          {/* Title */}
          <h3 className="admin-course-card__title">{course.title}</h3>

          {/* Author */}
          <p className="admin-course-card__author">
            <span className="label">Giảng viên:</span> {course.author}
          </p>

          {/* Category */}
          <p className="admin-course-card__category">
            <span className="label">Danh mục:</span> {course.categoryName}
          </p>

          {/* Description */}
          {course.description && (
            <p className="admin-course-card__description">
              {course.description.substring(0, 120)}...
            </p>
          )}

          {/* Rating */}
          <div className="admin-course-card__rating">
            <Rate disabled allowHalf value={course.rating} />
            <span className="rating-value">
              {course.rating.toFixed(1)} ({course.totalRatings} đánh giá)
            </span>
          </div>

          {/* Stats Row */}
          <div className="admin-course-card__stats">
            <div className="stat">
              <ClockCircleOutlined />
              <span>{course.duration}h</span>
            </div>
            <div className="stat">
              <FileTextOutlined />
              <span>{course.lessonCount} bài</span>
            </div>
            <div className="stat">
              <TeamOutlined />
              <span>{course.totalStudents} học viên</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="admin-course-card__price-section">
            {course.price === 0 ? (
              <div className="price-free">Miễn phí</div>
            ) : (
              <>
                <div className="price-current">
                  <DollarOutlined />
                  {discountedPrice.toLocaleString()}
                </div>
                {course.discount > 0 && (
                  <div className="price-original">
                    ${course.price.toLocaleString()}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Status Toggle Section */}
          <div className="admin-course-card__status-toggle">
            <span className="label">Trạng thái:</span>
            <Switch
              checked={isActive}
              onChange={(checked) =>
                handleStatusChange(course.courseId, checked)
              }
              checkedChildren="Active"
              unCheckedChildren="Draft"
            />
          </div>

          {/* Action Buttons */}
          <div className="admin-course-card__actions">
            <Tooltip title="Xem chi tiết">
              <Button
                type="default"
                icon={<EyeOutlined />}
                block
                onClick={() => navigate(`/courses/${course.slug}`)}
              >
                Chi tiết
              </Button>
            </Tooltip>

            <Tooltip title="Chỉnh sửa khóa học">
              <Button
                type="primary"
                icon={<EditOutlined />}
                block
                onClick={() =>
                  navigate(`/admin/courses/edit/${course.courseId}`)
                }
              >
                Sửa
              </Button>
            </Tooltip>

            <Tooltip title="Xóa khóa học">
              <Popconfirm
                title="Xác nhận xóa?"
                description="Hành động này không thể hoàn tác"
                onConfirm={() => handleDelete(course.courseId)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button danger icon={<DeleteOutlined />} block>
                  Xóa
                </Button>
              </Popconfirm>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  };

  // --- Loading Skeleton ---
  const renderSkeletons = () => (
    <div className="admin-course-card">
      <Skeleton.Image active style={{ width: "100%", height: 200 }} />
      <div style={{ padding: "16px" }}>
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    </div>
  );

  // --- Main JSX ---
  return (
    <div className="courses-management-container">
      {/* Header */}
      <div className="courses-management-header">
        <div className="header-content">
          <h1>Quản lý khóa học</h1>
          <p className="subtitle">
            Tổng cộng: <strong>{totalItems}</strong> khóa học
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/courses/new")}
          className="btn-create"
        >
          Thêm khóa học
        </Button>
      </div>

      {/* Filters */}
      <div className="courses-management-filters">
        <Input.Search
          placeholder="Tìm kiếm theo tiêu đề, giảng viên..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          style={{ width: 300 }}
          allowClear
          size="large"
        />
        <Select
          value={level}
          onChange={(v) => {
            setLevel(v);
            setPage(1);
          }}
          style={{ width: 200 }}
          size="large"
        >
          <Select.Option value="all">Tất cả trình độ</Select.Option>
          <Select.Option value="beginner">Beginner</Select.Option>
          <Select.Option value="intermediate">Intermediate</Select.Option>
          <Select.Option value="advanced">Advanced</Select.Option>
        </Select>
      </div>

      {/* Grid */}
      <Spin spinning={isLoading} size="large">
        {isError ? (
          <Empty description="Lỗi khi tải dữ liệu" />
        ) : courses.length === 0 ? (
          <Empty description="Không có khóa học nào" />
        ) : (
          <div className="courses-management-grid">
            {courses.map(renderCourseCard)}
          </div>
        )}

        {isLoading && (
          <div className="courses-management-grid">
            {Array.from({ length: pageSize }).map((_, idx) => (
              <div key={idx}>{renderSkeletons()}</div>
            ))}
          </div>
        )}
      </Spin>

      {/* Pagination */}
      {!isLoading && courses.length > 0 && (
        <div className="courses-management-pagination">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalItems}
            onChange={setPage}
            showSizeChanger={false}
            size="large"
          />
        </div>
      )}
    </div>
  );
};

export default CoursesManagement;
