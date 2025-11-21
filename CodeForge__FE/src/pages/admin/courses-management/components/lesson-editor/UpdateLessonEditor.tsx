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
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  BgColorsOutlined,
  CodeOutlined,
  UndoOutlined,
} from "@ant-design/icons";

import "./LessonEditor.scss";
import TextEditor from "@/common/components/tiny-editor/TinyEditor";

// Import Types
import type { CodingProblem } from "@/features/course/types";
import type { LessonDto, QuizQuestionDto } from "@/features/Lesson/types";

export type LessonType = "video" | "text" | "quiz" | "coding";

// Interface cho dữ liệu phẳng của Form
export interface LessonFormValues {
  title: string;
  duration: number;

  // Video
  videoUrl?: string;
  caption?: string;

  // Text
  content?: string;

  // Quiz & Coding (Description)
  description?: string;
  quizQuestions?: QuizQuestionDto[];

  // Coding
  language?: string;
  difficulty?: string;
  functionName?: string;
  constraints?: string;
  initialCode?: string;
  notes?: string;
}

interface LessonEditorProps {
  moduleId: string;
  lessons: LessonDto[];
  onLessonsChange: (lessons: LessonDto[]) => void;
}

const UpdateLessonEditor: React.FC<LessonEditorProps> = ({
  moduleId,
  lessons,
  onLessonsChange,
}) => {
  const [lessonModalVisible, setLessonModalVisible] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonDto | null>(null);
  const [selectedType, setSelectedType] = useState<LessonType>("video");
  const [form] = Form.useForm<LessonFormValues>();

  // 1. KHỞI TẠO FORM KHI MỞ MODAL
  useEffect(() => {
    if (lessonModalVisible) {
      if (editingLesson) {
        // --- CHẾ ĐỘ EDIT ---
        setSelectedType(editingLesson.lessonType);

        const formValues: LessonFormValues = {
          title: editingLesson.title,
          duration: editingLesson.duration / 60, // Giây -> Phút

          // Video
          videoUrl: editingLesson.videoContent?.videoUrl,
          caption: editingLesson.videoContent?.caption,

          // Text
          content: editingLesson.textContent?.content,

          // Quiz & Coding (Description dùng chung)
          description:
            editingLesson.quizContent?.description ||
            editingLesson.codingProblem?.description,

          // Quiz Questions (Map array vào Form.List)
          quizQuestions: editingLesson.quizContent?.questions || [],

          // Coding Problem
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
        form.resetFields();
        form.setFieldsValue({
          duration: 0,
          difficulty: "Easy",
          quizQuestions: [],
        });
      }
    }
  }, [lessonModalVisible, editingLesson, form]);

  // 2. XỬ LÝ LƯU (SUBMIT FORM)
  const handleSaveLesson = async () => {
    try {
      const values = await form.validateFields();

      // Validate riêng cho Quiz
      if (
        selectedType === "quiz" &&
        (!values.quizQuestions || values.quizQuestions.length === 0)
      ) {
        message.warning("Vui lòng thêm ít nhất một câu hỏi cho Quiz");
        return;
      }

      // Map dữ liệu từ Form (phẳng) sang DTO (lồng nhau)
      const finalLesson: LessonDto = {
        // IDs & Flags
        lessonId: editingLesson?.lessonId || "",
        moduleId: editingLesson?.moduleId || moduleId,
        isCompleted: editingLesson?.isCompleted || false,
        isDeleted: false, // Khi lưu form, chắc chắn lesson này đang active

        // Dữ liệu chung
        title: values.title,
        duration: (values.duration || 0) * 60, // Phút -> Giây
        lessonType: selectedType,
        // Nếu tạo mới thì xếp cuối cùng
        orderIndex:
          editingLesson?.orderIndex ||
          (lessons.length > 0
            ? Math.max(...lessons.map((l) => l.orderIndex)) + 1
            : 1),

        // Dữ liệu lồng nhau
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
                title: values.title,
                description: values.description || "",
                questions: values.quizQuestions || [],
              }
            : null,

        codingProblem:
          selectedType === "coding"
            ? ({
                lessonId: editingLesson?.lessonId || "",
                title: values.title,
                description: values.description || "",
                difficulty: values.difficulty || "Easy",
                language: values.language || "Python",
                functionName: values.functionName,
                constraints: values.constraints,
                initialCode: values.initialCode,
                notes: values.notes,
                slug: editingLesson?.codingProblem?.slug || "",
              } as CodingProblem)
            : null,
      };

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
      setLessonModalVisible(false);
    } catch (err) {
      console.error("Lỗi validate Form:", err);
      message.error("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleEditLesson = (lesson: LessonDto) => {
    setEditingLesson(lesson);
    setLessonModalVisible(true);
  };

  // 3. 🌟 LOGIC XÓA (HYBRID DELETE)
  const handleDeleteLesson = (index: number) => {
    const newList = [...lessons];
    const targetLesson = newList[index];

    // Nếu lesson chưa có ID (mới tạo ở frontend, chưa lưu DB) -> Xóa cứng
    if (!targetLesson.lessonId || targetLesson.lessonId.startsWith("temp_")) {
      newList.splice(index, 1);
      // Re-index lại
      const reIndexedList = newList.map((l, i) => ({
        ...l,
        orderIndex: i + 1,
      }));
      onLessonsChange(reIndexedList);
      message.success("Đã xóa bài học mới.");
    } else {
      // Nếu lesson cũ (có ID từ DB) -> Xóa mềm
      newList[index] = { ...targetLesson, isDeleted: true };
      onLessonsChange(newList);
      message.success("Đã đánh dấu xóa bài học.");
    }
  };

  // 4. 🌟 LOGIC KHÔI PHỤC (RESTORE)
  const handleRestoreLesson = (index: number) => {
    const newList = [...lessons];
    // Chỉ cần set isDeleted = false, dữ liệu cũ vẫn còn nguyên
    newList[index] = { ...newList[index], isDeleted: false };
    onLessonsChange(newList);
    message.success("Đã khôi phục bài học.");
  };

  // 5. RENDER FORM THEO LOẠI
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

            {/* --- Form.List cho Quiz Questions --- */}
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
                        <Button danger type="text" onClick={() => remove(name)}>
                          Xóa
                        </Button>
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

                      <Form.Item label="Đáp án (Chọn 1 đáp án đúng)">
                        <Form.Item
                          {...restField}
                          name={[name, "correctIndex"]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn đáp án đúng",
                            },
                          ]}
                          initialValue={0}
                        >
                          <Radio.Group style={{ width: "100%" }}>
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
                                  <Input
                                    placeholder={`Đáp án ${ansIdx + 1}`}
                                    style={{ width: "100%" }}
                                  />
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
                        question: "",
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
                  initialValue="Python"
                >
                  <Select>
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

  // --- RENDER CHÍNH ---
  return (
    <div className="lesson-editor-container">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingLesson(null);
          setLessonModalVisible(true);
        }}
        block
        size="middle"
        style={{ marginBottom: 16 }}
      >
        Thêm bài học
      </Button>

      <List
        dataSource={lessons.sort((a, b) => a.orderIndex - b.orderIndex)}
        renderItem={(lesson, index) => {
          const badge = getLessonTypeBadge(lesson.lessonType);

          // 🌟 Style mờ cho bài học đã xóa
          const itemStyle = lesson.isDeleted
            ? {
                opacity: 0.5,
                background: "#fff2f0",
                border: "1px dashed #ff4d4f",
              }
            : {};

          return (
            <List.Item
              key={index}
              style={itemStyle}
              className="lesson-item"
              actions={[
                // 1. Nút Sửa: Chỉ hiện khi chưa xóa
                !lesson.isDeleted && (
                  <Tooltip title="Chỉnh sửa">
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEditLesson(lesson)}
                    />
                  </Tooltip>
                ),

                // 2. Logic Nút Xóa / Khôi phục
                lesson.isDeleted ? (
                  <Tooltip title="Khôi phục bài học này">
                    <Button
                      type="primary"
                      ghost
                      size="small"
                      icon={<UndoOutlined />}
                      onClick={() => handleRestoreLesson(index)} // Dùng index trong mảng hiện tại
                    >
                      Khôi phục
                    </Button>
                  </Tooltip>
                ) : (
                  <Popconfirm
                    title="Xóa bài học?"
                    onConfirm={() => handleDeleteLesson(index)}
                    okText="Có"
                    cancelText="Không"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                ),
              ]}
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
                    {/* Tag báo đã xóa */}
                    {lesson.isDeleted && <Tag color="error">Đã xóa</Tag>}
                  </Space>
                }
              />
            </List.Item>
          );
        }}
        locale={{ emptyText: "Chưa có bài học nào" }}
      />

      {/* Modal thêm/sửa bài học */}
      <Modal
        title={editingLesson ? "Chỉnh sửa bài học" : "Thêm bài học"}
        open={lessonModalVisible}
        onOk={handleSaveLesson}
        onCancel={() => setLessonModalVisible(false)}
        width={700}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnHidden
        maskClosable={false}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề bài học"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input placeholder="VD: Giới thiệu Python" maxLength={200} />
          </Form.Item>
          <Form.Item name="duration" label="Thời lượng (phút)" initialValue={0}>
            <InputNumber min={0} max={480} style={{ width: "100%" }} />
          </Form.Item>

          <Divider>Loại bài học</Divider>

          <Form.Item label="Chọn loại">
            <Radio.Group
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              disabled={!!editingLesson}
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
                <CodeOutlined /> Coding
              </Radio>
            </Radio.Group>
          </Form.Item>

          <Divider />

          {renderTypeSpecificFields()}
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateLessonEditor;
