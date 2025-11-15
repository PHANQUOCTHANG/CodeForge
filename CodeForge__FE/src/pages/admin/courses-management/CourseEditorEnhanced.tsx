import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Tabs,
  Modal,
  List,
  Popconfirm,
  message,
  InputNumber,
  Checkbox,
  Divider,
  Row,
  Col,
  Space,
  Rate,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import LessonEditorEnhanced from "./LessonEditorEnhanced";
import type { Lesson } from "./LessonEditorEnhanced";
import { moduleApi, lessonApi } from "@/api/courseModuleLessonApi";
import api from "@/api/axios";
import RichTextEditor from "@/common/components/RichTextEditor";
import CloudinaryImageUpload from "@/common/components/CloudinaryImageUpload";
import "./CourseEditor.scss";

interface Module {
  moduleId?: string;
  title: string;
  orderIndex: number;
  lessons?: Lesson[];
}

interface CourseFormData {
  title: string;
  description: string;
  overview?: string;
  level: string;
  language: string;
  slug: string;
  categoryId?: string;
  thumbnail?: string;
  price: number;
  discount: number;
  duration: number;
  isPublished?: boolean;
}

interface CourseCategories {
  categoryId: string;
  name: string;
}

const CourseEditorEnhanced = ({ courseId }: { courseId?: string }) => {
  const [form] = Form.useForm<CourseFormData>();
  const [modules, setModules] = useState<Module[]>([]);
  const [moduleModalVisible, setModuleModalVisible] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [moduleForm] = Form.useForm();
  const navigate = useNavigate();

  // Image upload states (no longer needed - handled by component)
  // Categories state
  const [categories, setCategories] = useState<CourseCategories[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories on mount
  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await api.get("/api/CourseCategories");
      if (response.data.isSuccess) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      message.error("Không thể tải danh mục khóa học");
    } finally {
      setLoadingCategories(false);
    }
  };

  // Generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    form.setFieldValue("slug", slug);
  };

  // Handle create/update course with modules and lessons
  const handleCreateCourse = async (values: CourseFormData) => {
    const loadingKey = "courseCreation";

    try {
      message.loading({ content: "Đang tạo khóa học...", key: loadingKey });

      // Validate modules
      if (modules.length === 0) {
        message.warning("Vui lòng thêm ít nhất một module");
        return;
      }

      // 1. Create course with all fields
      const courseResponse = await api.post("/api/Courses/create", {
        title: values.title,
        description: values.description,
        overview: values.overview || values.description,
        level: values.level,
        language: values.language,
        slug: values.slug,
        categoryId: values.categoryId,
        thumbnail: values.thumbnail,
        price: values.price || 0,
        discount: values.discount || 0,
        duration: values.duration || 0,
        status: values.isPublished ? "active" : "draft",
        createdBy: localStorage.getItem("userId") || "system",
      });

      const courseId = courseResponse.data.data.courseId;
      console.log("Course created:", courseId);

      // 2. Create modules and lessons
      for (const module of modules) {
        // Create module
        const moduleResponse = await moduleApi.create({
          courseId,
          title: module.title,
          orderIndex: module.orderIndex,
        });

        const moduleId = moduleResponse.data.data.moduleId;
        console.log("Module created:", moduleId);

        // Create lessons for this module
        if (module.lessons && module.lessons.length > 0) {
          for (const lesson of module.lessons) {
            // Build lesson payload with type-specific fields
            const lessonPayload: Record<string, unknown> = {
              moduleId,
              title: lesson.title,
              description: lesson.description || "",
              orderIndex: lesson.orderIndex,
              type: lesson.type,
            };

            // Add type-specific fields
            const typedLesson = lesson as unknown as Record<string, unknown>;
            if (lesson.type === "video") {
              lessonPayload.videoUrl = typedLesson.videoUrl;
            } else if (lesson.type === "text") {
              lessonPayload.content = typedLesson.content;
            } else if (lesson.type === "coding") {
              lessonPayload.problemDescription = lesson.description;
              lessonPayload.language = typedLesson.language;
              lessonPayload.initialCode = typedLesson.initialCode;
            }

            // Create lesson via API
            await (lessonApi.create as (payload: unknown) => Promise<unknown>)(
              lessonPayload
            );
            console.log("Lesson created:", lesson.title);
          }
        }
      }

      message.success({
        content: "Khóa học được tạo thành công!",
        key: loadingKey,
      });

      // Navigate back to course list
      setTimeout(() => {
        navigate("/admin/courses");
      }, 1500);
    } catch (error) {
      console.error("Course creation error:", error);
      message.error({
        content: "Lỗi khi tạo khóa học. Vui lòng thử lại.",
        key: loadingKey,
      });
    }
  };

  // Add/Edit module
  const handleAddModule = async () => {
    try {
      const values = await moduleForm.validateFields();
      if (editingModule) {
        setModules(
          modules.map((m) =>
            m.orderIndex === editingModule.orderIndex
              ? { ...values, orderIndex: editingModule.orderIndex }
              : m
          )
        );
        message.success("Cập nhật module thành công");
      } else {
        const newModule: Module = {
          ...values,
          orderIndex: modules.length + 1,
        };
        setModules([...modules, newModule]);
        message.success("Thêm module thành công");
      }
      setModuleModalVisible(false);
      moduleForm.resetFields();
      setEditingModule(null);
    } catch {
      message.error("Vui lòng điền đầy đủ thông tin module");
    }
  };

  // Edit module
  const handleEditModule = (module: Module) => {
    moduleForm.setFieldsValue({
      title: module.title,
    });
    setEditingModule(module);
    setModuleModalVisible(true);
  };

  // Delete module
  const handleDeleteModule = (orderIndex: number) => {
    setModules(modules.filter((m) => m.orderIndex !== orderIndex));
    message.success("Xóa module thành công");
  };

  // Handle lessons change from LessonEditor
  const handleLessonsChange = (moduleIndex: number, newLessons: Lesson[]) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex] = {
      ...updatedModules[moduleIndex],
      lessons: newLessons,
    };
    setModules(updatedModules);
  };

  // Tab items for course form and modules
  const tabItems = [
    {
      key: "1",
      label: "📚 Thông tin cơ bản",
      children: (
        <Form layout="vertical" className="course-form" autoComplete="off">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="Tiêu đề khóa học"
                required
                tooltip="Tiêu đề nên ngắn, đầy đủ và hấp dẫn"
              >
                <Input
                  placeholder="VD: Python for Beginners"
                  onChange={handleTitleChange}
                  maxLength={200}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="Slug"
                required
                tooltip="Được tạo tự động từ tiêu đề, dùng để URL"
              >
                <Input placeholder="python-for-beginners" maxLength={200} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item label="Danh mục">
                <Select
                  placeholder="Chọn danh mục khóa học"
                  loading={loadingCategories}
                >
                  {categories.map((cat) => (
                    <Select.Option key={cat.categoryId} value={cat.categoryId}>
                      {cat.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item label="Cấp độ" required>
                <Select placeholder="Chọn cấp độ">
                  <Select.Option value="Beginner">Beginner</Select.Option>
                  <Select.Option value="Intermediate">
                    Intermediate
                  </Select.Option>
                  <Select.Option value="Advanced">Advanced</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item label="Ngôn ngữ" required>
                <Select placeholder="Chọn ngôn ngữ">
                  <Select.Option value="Python">Python</Select.Option>
                  <Select.Option value="JavaScript">JavaScript</Select.Option>
                  <Select.Option value="Java">Java</Select.Option>
                  <Select.Option value="C++">C++</Select.Option>
                  <Select.Option value="C#">C#</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item label="Thời lượng (phút)">
                <InputNumber
                  placeholder="VD: 240"
                  min={0}
                  max={10000}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Mô tả ngắn"
            required
            tooltip="Mô tả ngắn sẽ hiển thị trên thẻ khóa học"
          >
            <Input.TextArea
              placeholder="Mô tả khóa học của bạn..."
              rows={3}
              maxLength={255}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="Mô tả chi tiết (HTML)"
            tooltip="Mô tả chi tiết với định dạng HTML, được chỉnh sửa bằng CKEditor"
          >
            <RichTextEditor
              value={form.getFieldValue("overview")}
              onChange={(value) => form.setFieldValue("overview", value)}
              placeholder="Nhập mô tả chi tiết về khóa học..."
              height="400px"
            />
          </Form.Item>

          <Form.Item
            label="Hình ảnh thumbnail"
            tooltip="Hình ảnh đại diện của khóa học (được tải lên Cloudinary)"
          >
            <CloudinaryImageUpload
              value={form.getFieldValue("thumbnail")}
              onChange={(url) => form.setFieldValue("thumbnail", url)}
              folder="codeforge/courses"
              label="Thumbnail"
              required={false}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "2",
      label: "💰 Giá cả",
      children: (
        <Form layout="vertical" className="course-form">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="Giá gốc"
                tooltip="Giá cơ sở của khóa học (0 = miễn phí)"
              >
                <InputNumber
                  placeholder="VD: 99000"
                  min={0}
                  max={1000000}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="Giảm giá (%)"
                tooltip="Phần trăm giảm giá (0-100)"
              >
                <InputNumber
                  placeholder="VD: 20"
                  min={0}
                  max={100}
                  style={{ width: "100%" }}
                  suffix="%"
                />
              </Form.Item>
            </Col>
          </Row>

          <Card title="Tính toán giá">
            <Row gutter={16}>
              <Col span={12}>
                <div className="price-info">
                  <span>Giá gốc:</span>
                  <strong>{form.getFieldValue("price") || 0} VND</strong>
                </div>
              </Col>
              <Col span={12}>
                <div className="price-info">
                  <span>Giảm giá:</span>
                  <strong>
                    {((form.getFieldValue("price") || 0) *
                      (form.getFieldValue("discount") || 0)) /
                      100}{" "}
                    VND
                  </strong>
                </div>
              </Col>
              <Col span={12}>
                <div className="price-info final-price">
                  <span>Giá cuối cùng:</span>
                  <strong>
                    {Math.round(
                      (form.getFieldValue("price") || 0) *
                        (1 - (form.getFieldValue("discount") || 0) / 100)
                    )}{" "}
                    VND
                  </strong>
                </div>
              </Col>
            </Row>
          </Card>
        </Form>
      ),
    },
    {
      key: "3",
      label: "📦 Modules & Lessons",
      children: (
        <div className="modules-container">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              moduleForm.resetFields();
              setEditingModule(null);
              setModuleModalVisible(true);
            }}
            size="large"
            style={{ marginBottom: 16 }}
          >
            Thêm Module
          </Button>

          <List
            dataSource={modules}
            renderItem={(module, index) => (
              <Card
                key={index}
                className="module-card"
                style={{ marginBottom: 16 }}
                title={
                  <span>
                    📚 {module.orderIndex}. {module.title}
                  </span>
                }
                extra={
                  <Space>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEditModule(module)}
                    />
                    <Popconfirm
                      title="Xóa module?"
                      description="Bạn có chắc chắn muốn xóa module này?"
                      onConfirm={() => handleDeleteModule(module.orderIndex)}
                      okText="Có"
                      cancelText="Không"
                    >
                      <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                }
              >
                <Divider style={{ margin: "12px 0" }} />
                <LessonEditorEnhanced
                  moduleId={module.moduleId || ""}
                  lessons={module.lessons || []}
                  onLessonsChange={(newLessons: Lesson[]) =>
                    handleLessonsChange(index, newLessons)
                  }
                />
              </Card>
            )}
            locale={{ emptyText: "Chưa có module nào. Hãy thêm module mới." }}
          />
        </div>
      ),
    },
    {
      key: "4",
      label: "⚙️ Tùy chọn",
      children: (
        <Form layout="vertical" className="course-form">
          <Checkbox>
            Xuất bản khóa học (làm cho khóa học hiển thị công khai)
          </Checkbox>

          <Divider />

          <Card title="Thông tin thống kê">
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <div className="stat-item">
                  <span>Đánh giá</span>
                  <Rate disabled value={0} />
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="stat-item">
                  <span>Tổng học viên</span>
                  <strong>0</strong>
                </div>
              </Col>
            </Row>
          </Card>
        </Form>
      ),
    },
  ];

  return (
    <div className="course-editor-container">
      <Card
        title="Tạo/Chỉnh sửa Khóa học"
        className="course-editor-card"
        style={{ marginBottom: 24 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateCourse}
          autoComplete="off"
          scrollToFirstError
        >
          <Tabs items={tabItems} />

          <Divider />

          <div className="form-actions">
            <Button onClick={() => navigate("/admin/courses")}>Quay lại</Button>
            <Button type="primary" htmlType="submit" size="large">
              {courseId ? "Cập nhật khóa học" : "Tạo khóa học"}
            </Button>
          </div>
        </Form>
      </Card>

      {/* Module Modal */}
      <Modal
        title={editingModule ? "Chỉnh sửa Module" : "Thêm Module"}
        open={moduleModalVisible}
        onOk={handleAddModule}
        onCancel={() => {
          setModuleModalVisible(false);
          moduleForm.resetFields();
          setEditingModule(null);
        }}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={moduleForm} layout="vertical">
          <Form.Item
            name="title"
            label="Tên Module"
            rules={[{ required: true, message: "Vui lòng nhập tên module" }]}
          >
            <Input placeholder="VD: Giới thiệu Python" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseEditorEnhanced;
