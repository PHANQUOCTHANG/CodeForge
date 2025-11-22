// Các import của React và Ant Design
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Modal,
  List,
  Popconfirm,
  message,
  Radio,
  Divider,
  InputNumber,
  Row,
  Col,
  Space,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  BgColorsOutlined,
  CodeOutlined,
} from "@ant-design/icons";

// Import CSS và Component
import "./LessonEditor.scss";
import TextEditor from "@/common/components/tiny-editor/TinyEditor"; // Giả sử TextEditor đã được sửa

// Import Types (từ file types của bạn)
import type { LessonDto, QuizQuestionDto } from "@/features/Lesson/types"; // Điều chỉnh path nếu cần
import type { CodingProblem } from "@/features";

// --- Định nghĩa Types ---

export type LessonType = "video" | "text" | "quiz" | "coding";

/**
 * Interface cho dữ liệu phẳng (flat) bên trong Ant Design Form.
 * Khớp với các <Form.Item name="...">
 */
export interface LessonFormValues {
  title: string;
  duration: number; // Trường chung (phút)

  // Fields for 'video'
  videoUrl?: string;
  caption?: string;

  // Fields for 'text'
  content?: string;

  // Fields for 'quiz' & 'coding' (description)
  description?: string;
  quizQuestions?: QuizQuestionDto[]; // 👈 Sẽ được quản lý bởi Form.List

  // Fields for 'coding'
  language?: string;
  difficulty?: string;
  functionName?: string;
  constraints?: string;
  initialCode?: string;
  notes?: string;
}

interface LessonEditorProps {
  moduleId: string; // Dùng để gán cho bài học mới
  lessons: LessonDto[];
  onLessonsChange: (lessons: LessonDto[]) => void;
}

// --- Component ---

const CreateLessonEditor: React.FC<LessonEditorProps> = ({
  moduleId,
  lessons,
  onLessonsChange,
}) => {
  const [lessonModalVisible, setLessonModalVisible] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonDto | null>(null);
  const [selectedType, setSelectedType] = useState<LessonType>("video");
  const [form] = Form.useForm<LessonFormValues>();

  // KHÔNG DÙNG: [quizQuestions, setQuizQuestions] (đã chuyển vào Form.List)

  // Xử lý khi mở Modal (Add hoặc Edit)
  useEffect(() => {
    if (lessonModalVisible) {
      if (editingLesson) {
        // --- CHẾ ĐỘ EDIT ---
        // Map từ LessonDto (lồng nhau) sang LessonFormValues (phẳng)
        setSelectedType(editingLesson.lessonType);

        const formValues: LessonFormValues = {
          title: editingLesson.title,
          duration: editingLesson.duration / 60, // Giả sử lưu giây, hiển thị phút

          // Nạp dữ liệu theo type
          videoUrl: editingLesson.videoContent?.videoUrl,
          caption: editingLesson.videoContent?.caption,
          content: editingLesson.textContent?.content,
          description:
            editingLesson.quizContent?.description ||
            editingLesson.codingProblem?.description,
          quizQuestions: editingLesson.quizContent?.questions || [],

          // Cần ép kiểu (any) hoặc sửa type CodingProblem nếu có các trường này
          language: (editingLesson.codingProblem as any)?.language,
          difficulty: editingLesson.codingProblem?.difficulty,
          functionName: editingLesson.codingProblem?.functionName,
          constraints: editingLesson.codingProblem?.constraints,
          initialCode: (editingLesson.codingProblem as any)?.initialCode,
          notes: editingLesson.codingProblem?.notes,
        };
        form.setFieldsValue(formValues);
      } else {
        // --- CHẾ ĐỘ ADD ---
        setSelectedType("video");
        form.resetFields(); // Reset toàn bộ form
        form.setFieldsValue({
          duration: 0,
          difficulty: "Easy",
          quizQuestions: [],
        });
      }
    }
  }, [lessonModalVisible, editingLesson, form]);

  // Xử lý khi nhấn nút "Lưu" (OK)
  const handleSaveLesson = async () => {
    try {
      const values = await form.validateFields(); // values có kiểu LessonFormValues
      console.log("Form Values (flat):", values);

      // 1. Kiểm tra Quiz
      if (
        selectedType === "quiz" &&
        (!values.quizQuestions || values.quizQuestions.length === 0)
      ) {
        message.warning("Vui lòng thêm ít nhất một câu hỏi cho Quiz");
        return;
      }

      // 2. Map từ FormValues (phẳng) -> LessonDto (lồng nhau)
      const finalLesson: LessonDto = {
        // IDs
        lessonId: editingLesson?.lessonId || "", // Sẽ được gán ID thật ở backend
        moduleId: editingLesson?.moduleId || moduleId, // Lấy moduleId mới
        // Flags
        isCompleted: editingLesson?.isCompleted || false,
        // Dữ liệu chung
        title: values.title,
        duration: (values.duration || 0) * 60, // Chuyển phút về giây
        lessonType: selectedType,
        orderIndex: editingLesson?.orderIndex || lessons.length + 1, // Giữ index cũ hoặc +1

        // Dữ liệu lồng nhau (quan trọng)
        videoContent:
          selectedType === "video"
            ? {
                lessonId: editingLesson?.lessonId || "",
                videoUrl: values.videoUrl || "",
                caption: values.caption || "",
                duration: (values.duration || 0) * 60,
              }
            : null,

        textContent:
          selectedType === "text"
            ? {
                lessonId: editingLesson?.lessonId || "",
                content: values.content || "",
              }
            : null,

        quizContent:
          selectedType === "quiz"
            ? {
                lessonId: editingLesson?.lessonId || "",
                title: values.title, // Dùng title chung
                description: values.description || "",
                questions: values.quizQuestions || [], // Lấy từ Form
              }
            : null,

        codingProblem:
          selectedType === "coding"
            ? ({
                lessonId: editingLesson?.lessonId || "",
                title: values.title,
                description: values.description || "",
                difficulty: values.difficulty || "Easy",
                language: values.language || "Python", // (Cần thêm language vào type)
                functionName: values.functionName,
                constraints: values.constraints,
                initialCode: values.initialCode, // (Cần thêm vào type)
                notes: values.notes,
                slug: editingLesson?.codingProblem?.slug || "",
                // ... (các trường khác của CodingProblem)
              } as unknown as CodingProblem)
            : null, // Cần ép kiểu
      };

      console.log("Final Lesson DTO (nested):", finalLesson);

      // 3. Cập nhật state cha
      if (editingLesson) {
        onLessonsChange(
          lessons.map((l) =>
            l.orderIndex === editingLesson.orderIndex ? finalLesson : l
          )
        );
        message.success("Cập nhật bài học thành công");
      } else {
        onLessonsChange([...lessons, finalLesson]);
        message.success("Thêm bài học thành công");
      }

      setLessonModalVisible(false); // Đóng modal
    } catch (err) {
      console.error("Lỗi validate Form:", err);
      message.error("Vui lòng điền đầy đủ thông tin bài học");
    }
  };

  // Edit lesson
  const handleEditLesson = (lesson: LessonDto) => {
    setEditingLesson(lesson); // Đặt dữ liệu ban đầu
    setLessonModalVisible(true); // Mở modal (useEffect sẽ xử lý việc điền form)
  };

  // Delete lesson
  const handleDeleteLesson = (orderIndex: number) => {
    // Sắp xếp lại OrderIndex sau khi xóa
    const newList = lessons
      .filter((l) => l.orderIndex !== orderIndex)
      .map((l, index) => ({
        ...l,
        orderIndex: index + 1, // Đánh số lại
      }));
    onLessonsChange(newList);
    message.success("Xóa bài học thành công");
  };

  // Render type-specific form fields
  const renderTypeSpecificFields = () => {
    switch (selectedType) {
      case "video":
        return (
          <>
            <Form.Item
              name="videoUrl"
              label="Video URL"
              rules={[
                { required: true, message: "Vui lòng nhập URL video" },
                { pattern: /^https?:\/\/.+/, message: "URL không hợp lệ" },
              ]}
              tooltip="YouTube, Vimeo, hoặc Cloudinary URL"
            >
              <Input
                placeholder="https://youtube.com/watch?v=..."
                prefix={<PlayCircleOutlined />}
              />
            </Form.Item>
            <Form.Item name="caption" label="Chú thích (tùy chọn)">
              <TextEditor height={200} />
            </Form.Item>
          </>
        );

      case "text":
        return (
          <Form.Item
            name="content"
            label="Nội dung bài học"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <TextEditor />
          </Form.Item>
        );

      case "quiz":
        return (
          <>
            <Form.Item name="description" label="Mô tả Quiz">
              <TextEditor height={200} />
            </Form.Item>
            <Divider>Câu hỏi</Divider>

            {/* --- 🌟 SỬ DỤNG FORM.LIST --- */}
            <Form.List name="quizQuestions">
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map(({ key, name, ...restField }, idx) => (
                    <Card
                      key={key}
                      size="small"
                      style={{ marginBottom: 16 }}
                      title={`Câu ${idx + 1}`}
                      extra={
                        <Popconfirm
                          title="Xóa câu hỏi?"
                          onConfirm={() => remove(name)}
                        >
                          <Button type="text" danger size="small">
                            Xóa
                          </Button>
                        </Popconfirm>
                      }
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "question"]}
                        label="Câu hỏi"
                        rules={[
                          { required: true, message: "Vui lòng nhập câu hỏi" },
                        ]}
                      >
                        <Input.TextArea placeholder="Nhập câu hỏi" />
                      </Form.Item>

                      <Form.Item label="Các đáp án">
                        {/* Dùng Form.Item name={[name, 'correctIndex']} để quản lý Radio */}
                        <Form.Item
                          {...restField}
                          name={[name, "correctIndex"]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn đáp án đúng",
                            },
                          ]}
                          initialValue={0} // Mặc định chọn A
                        >
                          <Radio.Group>
                            {[0, 1, 2, 3].map((ansIdx) => (
                              <Space
                                key={ansIdx}
                                style={{ display: "flex", marginBottom: 8 }}
                                align="baseline"
                              >
                                <Radio value={ansIdx} />
                                <Form.Item
                                  {...restField}
                                  name={[name, "answers", ansIdx]}
                                  noStyle
                                  rules={[
                                    {
                                      required: true,
                                      message: "Vui lòng nhập đáp án",
                                    },
                                  ]}
                                >
                                  <Input placeholder={`Đáp án ${ansIdx + 1}`} />
                                </Form.Item>
                              </Space>
                            ))}
                          </Radio.Group>
                        </Form.Item>
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "explanation"]}
                        label="Giải thích (tùy chọn)"
                      >
                        <Input.TextArea
                          placeholder="Giải thích đáp án đúng"
                          rows={2}
                        />
                      </Form.Item>
                    </Card>
                  ))}

                  <Button
                    type="dashed"
                    block
                    icon={<PlusOutlined />}
                    onClick={() =>
                      add({
                        question: "", // Thêm giá trị mặc định khi tạo câu hỏi mới
                        answers: ["", "", "", ""],
                        correctIndex: 0,
                        explanation: "",
                      })
                    }
                  >
                    Thêm câu hỏi
                  </Button>
                  <Form.ErrorList errors={errors} />
                </>
              )}
            </Form.List>
          </>
        );

      case "coding":
        return (
          <>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="language"
                  label="Ngôn ngữ lập trình"
                  rules={[{ required: true, message: "Chọn ngôn ngữ" }]}
                >
                  <Select placeholder="Chọn ngôn ngữ">
                    <Select.Option value="Python">Python</Select.Option>
                    <Select.Option value="JavaScript">JavaScript</Select.Option>
                    <Select.Option value="Java">Java</Select.Option>
                    <Select.Option value="C++">C++</Select.Option>
                    <Select.Option value="C#">C#</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="difficulty"
                  label="Mức độ khó"
                  initialValue="Easy"
                >
                  <Select>
                    <Select.Option value="Easy">Dễ</Select.Option>
                    <Select.Option value="Medium">Trung bình</Select.Option>
                    <Select.Option value="Hard">Khó</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="description"
              label="Mô tả bài toán"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <TextEditor height={300} />
            </Form.Item>
            <Form.Item name="functionName" label="Tên hàm (tùy chọn)">
              <Input placeholder="VD: solve" />
            </Form.Item>
            <Form.Item name="constraints" label="Ràng buộc (tùy chọn)">
              <Input.TextArea placeholder="VD: 1 <= n <= 1000" />
            </Form.Item>
            <Form.Item name="initialCode" label="Mã khởi tạo (tùy chọn)">
              <Input.TextArea rows={4} placeholder="def solve():\n  pass" />
            </Form.Item>
            <Form.Item name="notes" label="Ghi chú (tùy chọn)">
              <Input.TextArea rows={2} placeholder="Ghi chú thêm..." />
            </Form.Item>
          </>
        );

      default:
        return null;
    }
  };

  // Get lesson type badge

  const getLessonTypeBadge = (type: LessonType) => {
    const badges: Record<
      LessonType,
      { icon: React.ReactNode; color: string; label: string }
    > = {
      video: { icon: <PlayCircleOutlined />, color: "#ff7a45", label: "Video" },
      text: { icon: <FileTextOutlined />, color: "#1890ff", label: "Bài viết" },
      quiz: { icon: <BgColorsOutlined />, color: "#faad14", label: "Quiz" },
      coding: { icon: <CodeOutlined />, color: "#52c41a", label: "Code" },
    };
    return badges[type];
  };
  return (
    <div className="lesson-editor-container">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingLesson(null); // Đặt là null để modal biết đây là "Add"
          setLessonModalVisible(true);
        }}
        block
        size="middle"
        style={{ marginBottom: 16 }}
      >
        Thêm bài học
      </Button>

      <List
        dataSource={lessons} // Dữ liệu từ props
        renderItem={(lesson, index) => {
          const badge = getLessonTypeBadge(lesson.lessonType);
          return (
            <List.Item
              key={index}
              actions={[
                <Tooltip title="Chỉnh sửa">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEditLesson(lesson)} // Mở modal edit
                  />
                </Tooltip>,
                <Popconfirm
                  title="Xóa bài học?"
                  onConfirm={() => handleDeleteLesson(lesson.orderIndex)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>,
              ]}
              className="lesson-item"
            >
              <List.Item.Meta
                avatar={
                  <span style={{ color: badge.color, fontSize: 18 }}>
                    {badge.icon}
                  </span>
                }
                title={
                  <Space>
                    <span>
                      {lesson.orderIndex}. {lesson.title}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        backgroundColor: badge.color,
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}
                    >
                      {badge.label}
                    </span>
                  </Space>
                }
              />
            </List.Item>
          );
        }}
        locale={{ emptyText: "Chưa có bài học nào" }}
      />

      {/* Lesson Modal */}
      <Modal
        title={editingLesson ? "Chỉnh sửa bài học" : "Thêm bài học"}
        open={lessonModalVisible}
        onOk={handleSaveLesson} // Nút OK sẽ trigger submit form
        onCancel={() => setLessonModalVisible(false)} // Chỉ cần đóng modal
        width={700}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnHidden // 👈 [QUAN TRỌNG] Tự động reset Form khi đóng
        maskClosable={false} // Chặn đóng modal khi click ra ngoài
      >
        <Form form={form} layout="vertical">
          {/* Trường chung */}
          <Form.Item
            name="title"
            label="Tiêu đề bài học"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input placeholder="VD: Giới thiệu Python" maxLength={200} />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Thời lượng (phút)"
            tooltip="Thời lượng ước tính của bài học"
            initialValue={0} // Đặt giá trị mặc định
          >
            <InputNumber min={0} max={480} style={{ width: "100%" }} />
          </Form.Item>

          <Divider>Loại bài học</Divider>

          <Form.Item label="Chọn loại">
            <Radio.Group
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              disabled={!!editingLesson} // 👈 Không cho đổi loại khi đang edit
            >
              <Radio value="video">
                <PlayCircleOutlined /> Video
              </Radio>
              <Radio value="text">
                <FileTextOutlined /> Bài viết
              </Radio>
              <Radio value="quiz">
                <BgColorsOutlined /> Quiz
              </Radio>
              <Radio value="coding">
                <CodeOutlined /> Bài tập lập trình
              </Radio>
            </Radio.Group>
          </Form.Item>

          <Divider>{/*getLessonTypeBadge(selectedType).label*/}</Divider>

          {renderTypeSpecificFields()}
        </Form>
      </Modal>
    </div>
  );
};

export default CreateLessonEditor;
