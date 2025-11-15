import { useState } from "react";
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
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import LessonEditor from "./LessonEditor";
import type { Lesson } from "./LessonEditor";
import { moduleApi, lessonApi } from "@/api/courseModuleLessonApi";
import api from "@/api/axios";
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
  level: string;
  language: string;
  slug: string;
}

const CourseEditor = ({ courseId }: { courseId?: string }) => {
  const [form] = Form.useForm<CourseFormData>();
  const [modules, setModules] = useState<Module[]>([]);
  const [moduleModalVisible, setModuleModalVisible] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [moduleForm] = Form.useForm();
  const navigate = useNavigate();

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

      // 1. Create course
      const courseResponse = await api.post("/api/Courses/create", {
        ...values,
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
      setEditingModule(null);
      moduleForm.resetFields();
    } catch {
      message.error("Vui lòng điền đủ thông tin module");
    }
  };

  // Delete module
  const handleDeleteModule = (orderIndex: number) => {
    setModules(modules.filter((m) => m.orderIndex !== orderIndex));
    message.success("Xóa module thành công");
  };

  // Open module modal for edit
  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setModuleModalVisible(true);
    moduleForm.setFieldsValue(module);
  };

  // Close module modal
  const handleCloseModuleModal = () => {
    setModuleModalVisible(false);
    setEditingModule(null);
    moduleForm.resetFields();
  };

  return (
    <div className="course-editor-container">
      <Card
        title={courseId ? "Chỉnh sửa khóa học" : "Tạo khóa học mới"}
        bordered={false}
      >
        <Tabs
          items={[
            {
              key: "course",
              label: "Thông tin khóa học",
              children: (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleCreateCourse}
                >
                  <Form.Item
                    name="title"
                    label="Tiêu đề khóa học"
                    rules={[
                      { required: true, message: "Vui lòng nhập tiêu đề" },
                    ]}
                  >
                    <Input placeholder="VD: Python for Beginners" />
                  </Form.Item>

                  <Form.Item
                    name="description"
                    label="Mô tả chi tiết"
                    rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Nhập mô tả chi tiết về khóa học..."
                    />
                  </Form.Item>

                  <Form.Item
                    name="level"
                    label="Trình độ"
                    rules={[
                      { required: true, message: "Vui lòng chọn trình độ" },
                    ]}
                  >
                    <Select>
                      <Select.Option value="beginner">Beginner</Select.Option>
                      <Select.Option value="intermediate">
                        Intermediate
                      </Select.Option>
                      <Select.Option value="advanced">Advanced</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="language"
                    label="Ngôn ngữ lập trình"
                    rules={[
                      { required: true, message: "Vui lòng nhập ngôn ngữ" },
                    ]}
                  >
                    <Input placeholder="VD: Python, JavaScript, C++" />
                  </Form.Item>

                  <Form.Item
                    name="slug"
                    label="Slug (URL)"
                    rules={[{ required: true, message: "Vui lòng nhập slug" }]}
                  >
                    <Input placeholder="VD: python-for-beginners" />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      {courseId ? "Cập nhật khóa học" : "Tạo khóa học"}
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: "modules",
              label: `Modules (${modules.length})`,
              children: (
                <div className="modules-section">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setEditingModule(null);
                      setModuleModalVisible(true);
                      moduleForm.resetFields();
                    }}
                    style={{ marginBottom: 16 }}
                  >
                    Thêm Module
                  </Button>

                  {modules.length === 0 ? (
                    <div className="empty-state">
                      Chưa có module nào. Hãy thêm module mới để bắt đầu.
                    </div>
                  ) : (
                    <List
                      dataSource={modules}
                      renderItem={(module, index) => (
                        <div key={module.orderIndex} className="module-item">
                          <List.Item
                            actions={[
                              <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={() => handleEditModule(module)}
                              />,
                              <Popconfirm
                                title="Xóa module?"
                                onConfirm={() =>
                                  handleDeleteModule(module.orderIndex)
                                }
                              >
                                <Button
                                  type="text"
                                  danger
                                  icon={<DeleteOutlined />}
                                />
                              </Popconfirm>,
                            ]}
                          >
                            <List.Item.Meta
                              title={`${index + 1}. ${module.title}`}
                              description={`${
                                module.lessons?.length || 0
                              } bài học`}
                            />
                          </List.Item>

                          {/* Lesson Editor for this Module */}
                          <div className="module-lessons">
                            <LessonEditor
                              moduleId={module.title}
                              lessons={module.lessons || []}
                              onLessonsChange={(updatedLessons) => {
                                setModules(
                                  modules.map((m) =>
                                    m.orderIndex === module.orderIndex
                                      ? { ...m, lessons: updatedLessons }
                                      : m
                                  )
                                );
                              }}
                            />
                          </div>
                        </div>
                      )}
                    />
                  )}
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Module Modal */}
      <Modal
        title={editingModule ? "Chỉnh sửa Module" : "Thêm Module mới"}
        open={moduleModalVisible}
        onCancel={handleCloseModuleModal}
        onOk={handleAddModule}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={moduleForm} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề Module"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input placeholder="VD: Cơ bản về Python" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseEditor;
