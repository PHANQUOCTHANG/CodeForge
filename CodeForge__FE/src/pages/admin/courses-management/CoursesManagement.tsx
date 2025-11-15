import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Input,
  Select,
  Popconfirm,
  message,
  Pagination,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import "./CoursesManagement.scss";
import axios from "axios";
import CourseEditorEnhanced from "./CourseEditorEnhanced";

const API_BASE_URL = "http://localhost:5000/api"; // TODO: Change to env variable

interface Course {
  courseId: string;
  title: string;
  description?: string;
  level: string;
  language?: string;
  slug: string;
  status?: string;
}

interface PaginationData {
  data: Course[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
}

const CoursesManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [level, setLevel] = useState("all");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [editorModalVisible, setEditorModalVisible] = useState(false);
  const pageSize = 8;

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const levelParam = level === "all" ? "" : level;
        const response = await axios.get<PaginationData>(
          `${API_BASE_URL}/Courses/paged`,
          {
            params: {
              page,
              pageSize,
              search: searchTerm,
              level: levelParam,
            },
          }
        );

        setCourses(response.data.data || []);
        setTotalItems(response.data.totalItems || 0);
      } catch (err) {
        message.error("Lỗi khi tải danh sách khóa học");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [page, searchTerm, level]);

  // Delete course
  const handleDelete = async (courseId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/Courses/${courseId}`);
      message.success("Xóa khóa học thành công");
      setPage(1);
    } catch (err) {
      message.error("Lỗi khi xóa khóa học");
      console.error(err);
    }
  };

  // Card UI
  const renderCourseCard = (course: Course) => (
    <div className="course-card-admin" key={course.courseId}>
      <div className="course-card-admin__content">
        <div className="course-card-admin__title">{course.title}</div>
        <div className="course-card-admin__desc">
          {course.description || "Không có mô tả"}
        </div>
        <div className="course-card-admin__meta">
          <span className="course-card-admin__badge course-card-admin__level">
            {course.level}
          </span>
          {course.language && (
            <span className="course-card-admin__badge course-card-admin__lang">
              {course.language}
            </span>
          )}
          <span className="course-card-admin__badge course-card-admin__slug">
            {course.slug}
          </span>
        </div>
      </div>
      <div className="course-card-admin__actions">
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
            setEditingCourse(course);
            setEditorModalVisible(true);
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
    </div>
  );

  return (
    <div className="courses-management-container">
      <div className="courses-management-header">
        <h1>Quản lý khóa học</h1>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setEditorModalVisible(true)}
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

      <Spin spinning={loading}>
        <div className="courses-management-grid">
          {courses.length > 0 ? (
            courses.map(renderCourseCard)
          ) : (
            <div className="empty">
              {loading ? "Đang tải..." : "Không có khóa học nào"}
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
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} của ${total} khóa học`
          }
        />
      </div>

      <Modal
        title={editingCourse ? "Chỉnh sửa khóa học" : "Thêm khóa học mới"}
        open={editorModalVisible}
        onCancel={() => {
          setEditorModalVisible(false);
          setEditingCourse(null);
          setPage(1);
        }}
        footer={null}
        width={900}
      >
        <CourseEditorEnhanced courseId={editingCourse?.courseId} />
      </Modal>
    </div>
  );
};

export default CoursesManagement;
