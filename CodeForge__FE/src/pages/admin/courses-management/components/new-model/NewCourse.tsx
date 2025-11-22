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

import "./CourseEditor.scss";

import TextEditor from "@/common/components/tiny-editor/TinyEditor";
import { sanitizeHtml } from "@/common/utils/sanitizeHtml";
import CloudinaryImageUpload from "@/common/components/CloudinaryImageUpload/CloudinaryImageUpload";

import type { ModuleDto } from "@/features/module/types";
import { calculateDiscount, type CreateCourseDto } from "@/features";

import type { CourseCategory } from "@/features/course-category/types";
import { useCreateCourse } from "@/features/course/hooks/useCreateCourse";
import CreateLessonEditor from "@/pages/admin/courses-management/components/lesson-editor/CreateLessonEditor";
import { useCourseCategories } from "@/features/course-category/hooks/useCoursesCategory";
// --- Component Con: PriceTabContent ---
const PriceTabContent: React.FC = () => {
  const price = Form.useWatch("price");
  const discount = Form.useWatch("discount");
  const finalPrice = calculateDiscount(price || 0, discount || 0);
  const formattedFinalPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(finalPrice);

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col md={12}>
          <Form.Item
            name="price"
            label="Giá gốc (VND)"
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
            initialValue={0}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/VND\s?|(,*)/g, "")}
            />
          </Form.Item>
        </Col>
        <Col md={12}>
          <Form.Item name="discount" label="Giảm giá (%)" initialValue={0}>
            <InputNumber style={{ width: "100%" }} min={0} max={100} />
          </Form.Item>
        </Col>
      </Row>
      <Card>
        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          Giá cuối: {formattedFinalPrice}
        </div>
      </Card>
    </>
  );
};
const CreateCourseEditor = ({ courseId }: { courseId?: string }) => {
  const [form] = Form.useForm<CreateCourseDto>();
  const [modules, setModules] = useState<ModuleDto[]>([]);
  const [moduleModalVisible, setModuleModalVisible] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleDto | null>(null);
  const [moduleForm] = Form.useForm();
  const createCourseMutation = useCreateCourse();
  const { data, isLoading } = useCourseCategories();
  const categories: CourseCategory[] = data || [];
  const navigate = useNavigate(); /** Submit form */

  const handleCreateCourse = async () => {
    const loadingKey = "courseCreation";

    try {
      message.loading({ key: loadingKey, content: "Đang xử lý..." });

      const values = await form.validateFields();
      const payloadStatus = values.status ? "active" : "draft";
      const thumbnailFile =
        values.thumbnail instanceof File ? values.thumbnail : null;

      const cleanDescription = sanitizeHtml(values.description);
      const cleanOverview = sanitizeHtml(values.overview || "");

      const sanitizedModules: ModuleDto[] = modules.map((mod) => ({
        ...mod,
        lessons: (mod.lessons || []).map((lesson) => {
          const copy = { ...lesson };

          if (lesson.lessonType === "text" && copy.textContent) {
            copy.textContent.content = sanitizeHtml(
              copy.textContent.content || ""
            );
          }

          if (lesson.lessonType === "quiz" && copy.quizContent) {
            copy.quizContent.description = sanitizeHtml(
              copy.quizContent.description || ""
            );
          }

          return copy;
        }),
      }));

      const payload: Omit<CreateCourseDto, "thumbnail"> = {
        ...values,
        description: cleanDescription,
        overview: cleanOverview,
        modules: sanitizedModules,
        status: payloadStatus,
      };
      console.log("Payload gửi đi:", payload, thumbnailFile);
      const res = await createCourseMutation.mutateAsync({
        courseData: payload,
        thumbnailFile,
      });
      console.log("Khóa học tạo thành công:", res);
      message.success({
        key: loadingKey,
        content: "Tạo khóa học thành công!",
      });
      form.resetFields();
      setModules([]);
      setModuleModalVisible(false);
      navigate("/admin/courses");
    } catch (err: any) {
      message.error({
        key: loadingKey,
        content: err.message || "Lỗi không xác định",
      });
    }
  }; /** Thêm hoặc sửa module */

  const handleAddModule = async () => {
    try {
      const values = await moduleForm.validateFields();

      if (editingModule) {
        setModules((prev) =>
          prev.map((m) =>
            m.orderIndex === editingModule.orderIndex
              ? { ...values, orderIndex: editingModule.orderIndex }
              : m
          )
        );
      } else {
        setModules((prev) => [
          ...prev,
          { ...values, orderIndex: prev.length + 1 },
        ]);
      }

      setEditingModule(null);
      moduleForm.resetFields();
      setModuleModalVisible(false);
      message.success("Lưu module thành công");
    } catch {
      console.log("Lỗi validate module");
    }
  }; /** Tab cấu hình */

  const tabItems = [
    {
      key: "1",
      label: "📚 Thông tin",
      children: (
        <>
          <Row gutter={[16, 16]}>
            <Col md={12}>
              <Form.Item
                tooltip="Nhập tiêu đề cho khóa học"
                name="title"
                label="Tiêu đề"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nhập tiêu đề khóa học" />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item
                tooltip="Chọn danh mục cho khóa học"
                name="categoryId"
                label="Danh mục"
                rules={[{ required: true }]}
              >
                <Select loading={isLoading} placeholder="--Chọn danh mục--">
                  {categories.map((cat) => (
                    <Select.Option key={cat.categoryId} value={cat.categoryId}>
                      {cat.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col md={12}>
              <Form.Item
                tooltip="Chọn cấp độ phù hợp cho khóa học"
                name="level"
                label="Cấp độ"
                rules={[{ required: true }]}
              >
                <Select placeholder="--Chọn cấp độ--">
                  <Select.Option value="beginner">Beginner</Select.Option>
                  <Select.Option value="intermediate">
                    Intermediate
                  </Select.Option>
                  <Select.Option value="advanced">Advanced</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item
                name="language"
                label="Ngôn ngữ"
                rules={[{ required: true }]}
                tooltip="Chọn ngôn ngữ chính cho khóa học"
              >
                <Select placeholder="--Chọn ngôn ngữ--">
                  <Select.Option value="Python">Python</Select.Option>
                  <Select.Option value="JavaScript">JavaScript</Select.Option>
                  <Select.Option value="Java">Java</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description" // 👈 Antd sẽ tự tìm 'value' và 'onChange'
            label="Mô tả ngắn"
            tooltip="Hiển thị trên danh sách khóa học" // initialValue="" // (Bạn có thể set giá trị mặc định ở đây)
          >
            {/* ✅ Đơn giản hóa: Không cần truyền prop thủ công */}
            <TextEditor height={300} />
          </Form.Item>

          <Form.Item
            name="overview" // 👈 Antd sẽ tự tìm 'value' và 'onChange'
            label="Mô tả chi tiết"
            tooltip="Mô tả chi tiết về khóa học"
          >
            {/* ✅ Đơn giản hóa */}
            <TextEditor height={500} />
          </Form.Item>

          <Form.Item
            name="thumbnail"
            label="Thumbnail"
            tooltip="Ảnh đại diện khóa học"
          >
            <CloudinaryImageUpload />
          </Form.Item>
        </>
      ),
    },

    { key: "2", label: "💰 Giá", children: <PriceTabContent /> }, // Sử dụng component con

    {
      key: "3",
      label: "📦 Modules & Lessons",
      children: (
        <>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModuleModalVisible(true)}
            style={{ marginBottom: 16 }}
          >
            Thêm module
          </Button>

          <List
            dataSource={modules}
            renderItem={(module, index) => (
              <Card
                key={index}
                title={module.title}
                extra={
                  <Space>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditingModule(module);
                        moduleForm.setFieldsValue(module);
                        setModuleModalVisible(true);
                      }}
                    />

                    <Popconfirm
                      title="Xóa module?"
                      okText="Có"
                      cancelText="Không"
                      onConfirm={() =>
                        setModules((prev) =>
                          prev.filter((m) => m.orderIndex !== module.orderIndex)
                        )
                      }
                    >
                      <Button danger type="text" icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                }
              >
                <CreateLessonEditor
                  moduleId={module.moduleId || ""}
                  lessons={module.lessons || []}
                  onLessonsChange={(lessons) =>
                    setModules((prev) => {
                      const copy = [...prev];
                      copy[index] = { ...copy[index], lessons };
                      return copy;
                    })
                  }
                />
              </Card>
            )}
          />
        </>
      ),
    },

    {
      key: "4",
      label: "⚙️ Tùy chọn",
      children: (
        <>
          <Form.Item name="status" valuePropName="checked" initialValue={false}>
            <Checkbox>Xuất bản khóa học</Checkbox>
          </Form.Item>

          <Card title="Thống kê">
            <Row>
              <Col span={12}>
                <Rate disabled value={0} />
              </Col>
              <Col span={12}>Học viên: 0</Col>
            </Row>
          </Card>
        </>
      ),
    },
  ];

  return (
    <div className="course-editor-container">
      <Button onClick={() => navigate("/admin/courses")}>Quay lại</Button>
      <Divider />
      <Card title="Tạo khóa học">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateCourse}
          autoComplete="off"
        >
          <Tabs items={tabItems} />
          <Divider />
          <div className="form-actions">
            <Button onClick={() => navigate("/admin/courses")}>Quay lại</Button>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={createCourseMutation.isPending}
            >
              {courseId ? "Cập nhật khóa học" : "Tạo khóa học"}
            </Button>
          </div>
        </Form>
      </Card>

      <Modal
        title={editingModule ? "Chỉnh sửa Module" : "Thêm Module"}
        open={moduleModalVisible}
        onOk={handleAddModule}
        onCancel={() => {
          moduleForm.resetFields();
          setEditingModule(null);
          setModuleModalVisible(false);
        }}
      >
        <Form form={moduleForm} layout="vertical">
          <Form.Item
            name="title"
            label="Tên module"
            rules={[{ required: true, message: "Tên module bắt buộc" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateCourseEditor;
