import React, { useState, useEffect } from "react";
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
  Tag,
  Tooltip, // 👈 Import Tag, Tooltip
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UndoOutlined, // 👈 Import UndoOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./CourseEditor.scss";

// --- Import Dependencies ---
import { useCourseCategory } from "@/features/category/hooks/useCoursesCategory";
import TextEditor from "@/common/components/tiny-editor/TinyEditor";
import { sanitizeHtml } from "@/common/utils/sanitizeHtml";
import CloudinaryImageUpload from "@/common/components/CloudinaryImageUpload/CloudinaryImageUpload";
import { useCreateCourse } from "@/features/course/hooks/useCreateCourse";
import { useEditCourse } from "@/features/course/hooks/useEditCourse";
import { calculateDiscount } from "@/features";
import type {
  CourseDetail,
  CreateCourseDto,
  UpdateCourseDto,
} from "@/features/course/types";
import type { TabsProps } from "antd";
import type { LessonDto, UpdateLessonDto } from "@/features/Lesson/types";

// Import component Lesson Editor (Dùng chung cho cả Create và Update)
import UpdateLessonEditor from "@/pages/admin/courses-management/components/lesson-editor/UpdateLessonEditor";
import type { ModuleDto } from "@/features/module/types";

// --- Props ---
interface CourseEditorProps {
  isEditMode?: boolean;
  initialData?: CourseDetail | null;
}

// --- Form Type ---
type CourseFormValues = Omit<CreateCourseDto, "status" | "modules"> & {
  status: boolean;
  thumbnail: File | string | null;
  categoryId: string;
};

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

// ======================================
// --- COMPONENT CHÍNH: COURSE EDITOR ---
// ======================================
const CourseEditor: React.FC<CourseEditorProps> = ({
  isEditMode = false,
  initialData = null,
}) => {
  const [form] = Form.useForm<CourseFormValues>();
  const [modules, setModules] = useState<ModuleDto[]>([]);
  const [moduleModalVisible, setModuleModalVisible] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleDto | null>(null);
  const [moduleForm] = Form.useForm();

  const createCourseMutation = useCreateCourse();
  const editCourseMutation = useEditCourse();
  const { data: categories, isLoading: isLoadingCategories } =
    useCourseCategory();
  const navigate = useNavigate();
  const isSubmitting =
    createCourseMutation.isPending || editCourseMutation.isPending;

  // 🌟 KHỞI TẠO DỮ LIỆU (INIT DATA)
  useEffect(() => {
    if (isEditMode && initialData) {
      console.log("🔄 Init Data for Edit Mode:", initialData);

      // 1. Map dữ liệu phẳng vào Form
      const formValues: Partial<CourseFormValues> = {
        title: initialData.title,
        description: initialData.description || "",
        overview: initialData.overview || "",
        level: initialData.level as any,
        language: initialData.language,
        categoryId: initialData.categoryId,
        price: initialData.price,
        discount: initialData.discount,
        duration: initialData.duration,
        lessonCount: initialData.lessonCount,
        status: initialData.status === "active",
        thumbnail: initialData.thumbnail || null,
      };
      form.setFieldsValue(formValues);

      // 2. Map dữ liệu lồng nhau (Modules & Lessons) vào State
      if (initialData.modules && initialData.modules.length > 0) {
        const mappedModules: ModuleDto[] = initialData.modules.map((mod) => ({
          moduleId: mod.moduleId,
          courseId: mod.courseId,
          title: mod.title,
          orderIndex: mod.orderIndex,
          // Lấy giá trị thực từ DB (true hoặc false)
          isDeleted: mod.isDeleted,
          lessons: (mod.lessons || []).map((lesson) => ({
            ...lesson,
            isCompleted: lesson.isCompleted || false,
            isDeleted: lesson.isDeleted, // Lấy giá trị thực từ DB
            videoContent: lesson.videoContent
              ? { ...lesson.videoContent }
              : null,
            textContent: lesson.textContent ? { ...lesson.textContent } : null,
            quizContent: lesson.quizContent
              ? {
                  ...lesson.quizContent,
                  questions: lesson.quizContent.questions.map((q) => ({
                    ...q,
                  })),
                }
              : null,
            codingProblem: lesson.codingProblem
              ? { ...lesson.codingProblem }
              : null,
          })),
        }));

        mappedModules.sort((a, b) => a.orderIndex - b.orderIndex);
        mappedModules.forEach((m) =>
          m.lessons.sort((a, b) => a.orderIndex - b.orderIndex)
        );

        setModules(mappedModules);
      } else {
        setModules([]);
      }
    }
  }, [isEditMode, initialData, form]);

  /** 🌟 Hàm Submit Form */
  /** 🌟 Hàm Submit Form (Đã Fix lỗi lessonId = "") */
  const handleSubmitCourse = async () => {
    const loadingKey = "courseSubmit";
    try {
      message.loading({ key: loadingKey, content: "Đang xử lý..." });
      const values = await form.validateFields();

      const payloadStatus = values.status ? "active" : "draft";
      const thumbnailFile =
        values.thumbnail instanceof File ? (values.thumbnail as File) : null;
      const cleanDescription = sanitizeHtml(values.description || "");
      const cleanOverview = sanitizeHtml(values.overview || "");

      // --- XỬ LÝ DATA & ID ---
      const sanitizedModules: ModuleDto[] = modules.map((mod) => {
        // 1. Xử lý Module ID
        let cleanModuleId = mod.moduleId;
        // Nếu là chuỗi rỗng, hoặc temp, hoặc độ dài sai -> Gán NULL
        if (
          !cleanModuleId ||
          cleanModuleId.toString().startsWith("temp_") ||
          cleanModuleId.length < 36
        ) {
          cleanModuleId = null as any;
        }

        return {
          ...mod,
          moduleId: cleanModuleId,

          lessons: (mod.lessons || []).map((lesson) => {
            // 2. Xử lý Lesson ID
            let cleanLessonId = lesson.lessonId;
            // Nếu là chuỗi rỗng, hoặc temp, hoặc độ dài sai -> Gán NULL
            if (
              !cleanLessonId ||
              cleanLessonId.toString().startsWith("temp_") ||
              cleanLessonId.length < 36
            ) {
              cleanLessonId = null as any;
            }

            // 3. Deep copy và sanitize nội dung
            const copy = JSON.parse(JSON.stringify(lesson));

            // Sanitize HTML
            if (copy.lessonType === "text" && copy.textContent) {
              copy.textContent.content = sanitizeHtml(
                copy.textContent.content || ""
              );
              // ⚠️ Fix ID trong Content luôn cho chắc
              copy.textContent.lessonId = cleanLessonId;
            }
            if (copy.lessonType === "quiz" && copy.quizContent) {
              copy.quizContent.description = sanitizeHtml(
                copy.quizContent.description || ""
              );
              copy.quizContent.lessonId = cleanLessonId;
            }
            if (copy.lessonType === "video" && copy.videoContent) {
              copy.videoContent.lessonId = cleanLessonId;
            }
            if (copy.lessonType === "coding" && copy.codingProblem) {
              copy.codingProblem.lessonId = cleanLessonId;
            }

            // Trả về object
            return {
              ...copy,
              lessonId: cleanLessonId, // ✅ Đảm bảo là null nếu là bài mới
              moduleId: cleanModuleId,
              duration: lesson.duration || 0,
              orderIndex: lesson.orderIndex || 0,
              isCompleted: lesson.isCompleted || false,
              isDeleted: lesson.isDeleted || false, // Đảm bảo không undefined
            };
          }),
        };
      });

      const { thumbnail, status, ...restOfValues } = values;

      const basePayload = {
        ...restOfValues,
        description: cleanDescription,
        overview: cleanOverview,
        modules: sanitizedModules,
      };

      if (isEditMode && initialData) {
        // --- EDIT ---
        const editPayload: UpdateCourseDto = {
          ...basePayload,
          status: payloadStatus,
          thumbnail: thumbnailFile ? null : (values.thumbnail as string | null),
        };

        // 👇 Log để kiểm tra lần cuối
        console.log(
          "🚀 Payload Edit (Fixed):",
          JSON.stringify(editPayload, null, 2)
        );

        await editCourseMutation.mutateAsync({
          courseId: initialData.courseId,
          courseData: editPayload,
          thumbnailFile: thumbnailFile,
          originalThumbnailUrl: initialData.thumbnail,
        });
      } else {
        // --- CREATE ---
        const modulesToCreate = sanitizedModules.filter((m) => !m.isDeleted);
        const createPayload: CreateCourseDto = {
          ...basePayload,
          modules: modulesToCreate,
          status: payloadStatus,
          rating: 0,
          totalRatings: 0,
          totalStudents: 0,
          lessonCount: modulesToCreate.reduce(
            (acc, m) => acc + m.lessons.filter((l) => !l.isDeleted).length,
            0
          ),
          createdBy: "",
          slug: "",
        };

        await createCourseMutation.mutateAsync({
          courseData: createPayload,
          thumbnailFile: thumbnailFile,
        });
      }

      message.destroy(loadingKey);
      if (!isEditMode) {
        form.resetFields();
        setModules([]);
      }
    } catch (err: any) {
      console.error(err);
      message.error({
        key: loadingKey,
        content: err.message || "Lỗi. Vui lòng kiểm tra lại thông tin.",
      });
    }
  };

  /** Thêm/Sửa Module */
  const handleAddModule = async () => {
    try {
      const values = await moduleForm.validateFields();
      if (editingModule) {
        setModules((prev) =>
          prev
            .map((m) =>
              m.orderIndex === editingModule.orderIndex
                ? { ...editingModule, ...values }
                : m
            )
            .sort((a, b) => a.orderIndex - b.orderIndex)
        );
        message.success("Cập nhật module thành công");
      } else {
        const newModule: ModuleDto = {
          moduleId: `temp_${Date.now()}`,
          courseId: initialData?.courseId || "",
          title: values.title,
          // Tính index dựa trên max index hiện tại
          orderIndex:
            (modules.length > 0
              ? Math.max(...modules.map((m) => m.orderIndex))
              : 0) + 1,
          lessons: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isDeleted: false, // Mới tạo thì chưa xóa
        };
        setModules((prev) => [...prev, newModule]);
        message.success("Thêm module thành công");
      }
      setModuleModalVisible(false);
    } catch {
      message.error("Lỗi. Vui lòng nhập tên module.");
    }
  };

  const handleCancelModuleModal = () => {
    moduleForm.resetFields();
    setEditingModule(null);
    setModuleModalVisible(false);
  };

  const handleLessonsChange = (
    moduleId: string,
    newLessons: UpdateLessonDto[]
  ) => {
    setModules((prev) =>
      prev.map((mod) =>
        mod.moduleId === moduleId
          ? { ...mod, lessons: newLessons as LessonDto[] }
          : mod
      )
    );
  };

  // 🌟 [QUAN TRỌNG] Hàm Xóa Module (Soft Delete & Hard Delete)
  const handleDeleteModule = (targetModule: ModuleDto) => {
    setModules((prev) => {
      // Nếu là module mới (chưa lưu DB) -> Xóa cứng
      if (targetModule.moduleId.startsWith("temp_")) {
        const filtered = prev.filter(
          (m) => m.moduleId !== targetModule.moduleId
        );
        // Re-index lại để không bị thủng lỗ
        return filtered.map((m, i) => ({ ...m, orderIndex: i + 1 }));
      }

      // Nếu là module cũ -> Xóa mềm (đánh dấu)
      return prev.map((m) =>
        m.moduleId === targetModule.moduleId ? { ...m, isDeleted: true } : m
      );
    });
    message.success(
      targetModule.moduleId.startsWith("temp_")
        ? "Đã xóa module."
        : "Đã đánh dấu xóa module."
    );
  };

  // 🌟 [QUAN TRỌNG] Hàm Khôi Phục Module
  const handleRestoreModule = (targetModule: ModuleDto) => {
    setModules((prev) =>
      prev.map((m) =>
        m.moduleId === targetModule.moduleId ? { ...m, isDeleted: false } : m
      )
    );
    message.success("Đã khôi phục module.");
  };

  /** Cấu hình Tabs */
  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "📚 Thông tin",
      children: (
        <>
          <Row gutter={[16, 16]}>
            <Col md={12}>
              <Form.Item
                name="title"
                label="Tiêu đề"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                name="categoryId"
                label="Danh mục"
                rules={[{ required: true }]}
              >
                <Select
                  loading={isLoadingCategories}
                  placeholder="Chọn danh mục"
                >
                  {categories?.map((cat) => (
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
                name="level"
                label="Cấp độ"
                rules={[{ required: true }]}
                initialValue="beginner"
              >
                <Select>
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
                initialValue="JavaScript"
              >
                <Select>
                  <Select.Option value="Python">Python</Select.Option>
                  <Select.Option value="JavaScript">JavaScript</Select.Option>
                  <Select.Option value="Java">Java</Select.Option>
                  <Select.Option value="C#">C#</Select.Option>
                  <Select.Option value="C++">C++</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Mô tả ngắn">
            <TextEditor height={200} />
          </Form.Item>
          <Form.Item name="overview" label="Mô tả chi tiết">
            <TextEditor height={400} />
          </Form.Item>
          <Form.Item name="thumbnail" label="Thumbnail">
            <CloudinaryImageUpload />
          </Form.Item>
        </>
      ),
    },
    { key: "2", label: "💰 Giá", children: <PriceTabContent /> },
    {
      key: "3",
      label: "📦 Modules & Lessons",
      children: (
        <>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingModule(null);
              moduleForm.resetFields();
              setModuleModalVisible(true);
            }}
            style={{ marginBottom: 16 }}
          >
            Thêm module
          </Button>

          <List
            dataSource={modules} // Không sort ở đây để tránh nhảy vị trí khi module bị xóa mềm
            renderItem={(module) => {
              // 🌟 Style cho module đã xóa
              const cardStyle = module.isDeleted
                ? {
                    marginBottom: 16,
                    opacity: 0.6,
                    background: "#fff1f0",
                    border: "1px dashed #ff4d4f",
                  }
                : { marginBottom: 16 };

              return (
                <Card
                  key={module.moduleId}
                  style={cardStyle}
                  title={
                    <Space>
                      {`Module ${module.orderIndex}: ${module.title}`}
                      {module.isDeleted && <Tag color="error">Đã xóa</Tag>}
                    </Space>
                  }
                  extra={
                    <Space>
                      {/* Nút Sửa chỉ hiện khi chưa xóa */}
                      {!module.isDeleted && (
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => {
                            setEditingModule(module);
                            moduleForm.setFieldsValue(module);
                            setModuleModalVisible(true);
                          }}
                        />
                      )}

                      {/* Nút Xóa hoặc Khôi phục */}
                      {module.isDeleted ? (
                        <Tooltip title="Khôi phục module này">
                          <Button
                            type="primary"
                            ghost
                            size="small"
                            icon={<UndoOutlined />}
                            onClick={() => handleRestoreModule(module)}
                          >
                            Khôi phục
                          </Button>
                        </Tooltip>
                      ) : (
                        <Popconfirm
                          title="Xóa module này?"
                          description="Tất cả bài học bên trong cũng sẽ bị xóa."
                          okText="Có, Xóa"
                          cancelText="Không"
                          onConfirm={() => handleDeleteModule(module)}
                        >
                          <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                          />
                        </Popconfirm>
                      )}
                    </Space>
                  }
                >
                  {/* Ẩn nội dung bài học nếu module bị xóa để đỡ rối */}
                  {!module.isDeleted && (
                    <UpdateLessonEditor
                      moduleId={module.moduleId}
                      lessons={module.lessons || []}
                      onLessonsChange={(newLessons) =>
                        handleLessonsChange(module.moduleId, newLessons)
                      }
                    />
                  )}
                  {module.isDeleted && (
                    <div
                      style={{
                        fontStyle: "italic",
                        color: "#999",
                        padding: "10px",
                      }}
                    >
                      Nội dung module đã bị ẩn do đánh dấu xóa.
                    </div>
                  )}
                </Card>
              );
            }}
            locale={{ emptyText: "Chưa có module nào." }}
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
                <Rate disabled allowHalf value={initialData?.rating || 0} /> (
                {initialData?.totalRatings || 0} đánh giá)
              </Col>
              <Col span={12}>Học viên: {initialData?.totalStudents || 0}</Col>
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
      <Card
        title={
          isEditMode
            ? `Chỉnh sửa: ${initialData?.title || "Khóa học"}`
            : "Tạo khóa học mới"
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitCourse}
          autoComplete="off"
        >
          <Tabs items={tabItems} defaultActiveKey="1" />
          <Divider />
          <div className="form-actions">
            <Button onClick={() => navigate("/admin/courses")}>Quay lại</Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isSubmitting}
            >
              {isEditMode ? "Cập nhật khóa học" : "Tạo khóa học"}
            </Button>
          </div>
        </Form>
      </Card>
      <Modal
        title={editingModule ? "Chỉnh sửa Module" : "Thêm Module"}
        open={moduleModalVisible}
        onOk={handleAddModule}
        onCancel={handleCancelModuleModal}
        destroyOnHidden
      >
        <Form form={moduleForm} layout="vertical">
          <Form.Item
            name="title"
            label="Tên module"
            rules={[{ required: true, message: "Tên module bắt buộc" }]}
          >
            <Input placeholder="Ví dụ: Chương 1: Giới thiệu" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseEditor;
