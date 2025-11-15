import React, { useState } from "react";
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
import "./LessonEditor.scss";

export type LessonType = "video" | "text" | "quiz" | "coding";

export interface LessonBase {
  lessonId?: string;
  title: string;
  description?: string;
  orderIndex: number;
  type: LessonType;
  duration?: number;
}

export interface VideoLesson extends LessonBase {
  type: "video";
  videoUrl: string;
  duration?: number;
}

export interface TextLesson extends LessonBase {
  type: "text";
  content: string;
}

export interface QuizQuestion {
  questionId?: string;
  question: string;
  answers: string[];
  correctIndex: number;
  explanation?: string;
}

export interface QuizLesson extends LessonBase {
  type: "quiz";
  title: string;
  questions: QuizQuestion[];
}

export interface CodingLesson extends LessonBase {
  type: "coding";
  problemId?: string;
  description: string;
  initialCode?: string;
  language: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  functionName?: string;
  constraints?: string;
  notes?: string;
}

export type Lesson = VideoLesson | TextLesson | QuizLesson | CodingLesson;

interface LessonEditorProps {
  moduleId: string;
  lessons: Lesson[];
  onLessonsChange: (lessons: Lesson[]) => void;
}

const LessonEditorEnhanced: React.FC<LessonEditorProps> = ({
  lessons,
  onLessonsChange,
}) => {
  const [lessonModalVisible, setLessonModalVisible] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedType, setSelectedType] = useState<LessonType>("video");
  const [form] = Form.useForm();
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  // Handle add/update lesson
  const handleAddLesson = async () => {
    try {
      const values = await form.validateFields();

      let newLesson: Lesson;

      if (selectedType === "quiz") {
        if (quizQuestions.length === 0) {
          message.warning("Vui lòng thêm ít nhất một câu hỏi");
          return;
        }
        newLesson = {
          ...values,
          type: "quiz",
          orderIndex: editingLesson?.orderIndex || lessons.length + 1,
          questions: quizQuestions,
        } as QuizLesson;
      } else {
        newLesson = {
          ...values,
          orderIndex: editingLesson?.orderIndex || lessons.length + 1,
          type: selectedType,
        } as Lesson;
      }

      if (editingLesson) {
        onLessonsChange(
          lessons.map((l) =>
            l.orderIndex === editingLesson.orderIndex ? newLesson : l
          )
        );
        message.success("Cập nhật bài học thành công");
      } else {
        onLessonsChange([...lessons, newLesson]);
        message.success("Thêm bài học thành công");
      }

      setLessonModalVisible(false);
      form.resetFields();
      setEditingLesson(null);
      setQuizQuestions([]);
      setSelectedType("video");
    } catch {
      message.error("Vui lòng điền đầy đủ thông tin bài học");
    }
  };

  // Edit lesson
  const handleEditLesson = (lesson: Lesson) => {
    setSelectedType(lesson.type);
    form.setFieldsValue({
      title: lesson.title,
      description: lesson.description,
      duration: lesson.duration,
      ...(lesson.type === "video" && {
        videoUrl: (lesson as VideoLesson).videoUrl,
      }),
      ...(lesson.type === "text" && {
        content: (lesson as TextLesson).content,
      }),
      ...(lesson.type === "coding" && {
        language: (lesson as CodingLesson).language,
        initialCode: (lesson as CodingLesson).initialCode,
        difficulty: (lesson as CodingLesson).difficulty,
        functionName: (lesson as CodingLesson).functionName,
        constraints: (lesson as CodingLesson).constraints,
        notes: (lesson as CodingLesson).notes,
      }),
    });
    if (lesson.type === "quiz") {
      setQuizQuestions((lesson as QuizLesson).questions);
    }
    setEditingLesson(lesson);
    setLessonModalVisible(true);
  };

  // Delete lesson
  const handleDeleteLesson = (orderIndex: number) => {
    onLessonsChange(lessons.filter((l) => l.orderIndex !== orderIndex));
    message.success("Xóa bài học thành công");
  };

  // Quiz question handlers
  const handleAddQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      {
        question: "",
        answers: ["", "", "", ""],
        correctIndex: 0,
        explanation: "",
      },
    ]);
  };

  const handleUpdateQuestion = (
    index: number,
    question: Partial<QuizQuestion>
  ) => {
    const updated = [...quizQuestions];
    updated[index] = { ...updated[index], ...question };
    setQuizQuestions(updated);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuizQuestions(quizQuestions.filter((_, i) => i !== index));
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
                {
                  pattern: /^https?:\/\/.+/,
                  message: "URL phải bắt đầu bằng http:// hoặc https://",
                },
              ]}
              tooltip="YouTube, Vimeo, hoặc Cloudinary URL"
            >
              <Input
                placeholder="https://youtube.com/watch?v=..."
                prefix={<PlayCircleOutlined />}
              />
            </Form.Item>
            <Form.Item name="duration" label="Thời lượng (phút)">
              <InputNumber min={0} max={480} style={{ width: "100%" }} />
            </Form.Item>
          </>
        );

      case "text":
        return (
          <Form.Item
            name="content"
            label="Nội dung bài học"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung bài học" },
            ]}
            tooltip="Hỗ trợ HTML hoặc Markdown"
          >
            <Input.TextArea
              rows={6}
              placeholder="Nhập nội dung bài học..."
              maxLength={5000}
              showCount
            />
          </Form.Item>
        );

      case "quiz":
        return (
          <>
            <Form.Item
              name="title"
              label="Tiêu đề Quiz"
              rules={[
                { required: true, message: "Vui lòng nhập tiêu đề quiz" },
              ]}
            >
              <Input placeholder="VD: Quiz Chương 1" maxLength={200} />
            </Form.Item>

            <Divider>Câu hỏi ({quizQuestions.length})</Divider>

            <Button
              type="dashed"
              block
              icon={<PlusOutlined />}
              onClick={handleAddQuestion}
              style={{ marginBottom: 16 }}
            >
              Thêm câu hỏi
            </Button>

            <div className="quiz-questions-container">
              {quizQuestions.map((q, idx) => (
                <Card
                  key={idx}
                  size="small"
                  style={{ marginBottom: 16 }}
                  title={`Câu ${idx + 1}`}
                  extra={
                    <Popconfirm
                      title="Xóa câu hỏi?"
                      onConfirm={() => handleDeleteQuestion(idx)}
                      okText="Có"
                      cancelText="Không"
                    >
                      <Button type="text" danger size="small">
                        Xóa
                      </Button>
                    </Popconfirm>
                  }
                >
                  <Form layout="vertical">
                    <Form.Item label="Câu hỏi">
                      <Input
                        value={q.question}
                        onChange={(e) =>
                          handleUpdateQuestion(idx, {
                            question: e.target.value,
                          })
                        }
                        placeholder="Nhập câu hỏi"
                      />
                    </Form.Item>

                    <Form.Item label="Đáp án">
                      {q.answers.map((answer, ansIdx) => (
                        <div key={ansIdx} style={{ marginBottom: 8 }}>
                          <Input
                            placeholder={`Đáp án ${ansIdx + 1}`}
                            value={answer}
                            onChange={(e) => {
                              const newAnswers = [...q.answers];
                              newAnswers[ansIdx] = e.target.value;
                              handleUpdateQuestion(idx, {
                                answers: newAnswers,
                              });
                            }}
                            prefix={
                              <Radio
                                checked={q.correctIndex === ansIdx}
                                onChange={() =>
                                  handleUpdateQuestion(idx, {
                                    correctIndex: ansIdx,
                                  })
                                }
                              />
                            }
                          />
                        </div>
                      ))}
                    </Form.Item>

                    <Form.Item label="Giải thích">
                      <Input.TextArea
                        value={q.explanation}
                        onChange={(e) =>
                          handleUpdateQuestion(idx, {
                            explanation: e.target.value,
                          })
                        }
                        placeholder="Giải thích đáp án đúng"
                        rows={2}
                      />
                    </Form.Item>
                  </Form>
                </Card>
              ))}
            </div>
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
                  initialValue="Medium"
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
              tooltip="Mô tả chi tiết bài toán"
            >
              <Input.TextArea
                rows={4}
                placeholder="Mô tả bài toán..."
                maxLength={2000}
                showCount
              />
            </Form.Item>

            <Form.Item name="functionName" label="Tên hàm">
              <Input placeholder="VD: solve" maxLength={100} />
            </Form.Item>

            <Form.Item name="constraints" label="Ràng buộc">
              <Input.TextArea
                rows={2}
                placeholder="VD: 1 <= n <= 1000"
                maxLength={500}
              />
            </Form.Item>

            <Form.Item
              name="initialCode"
              label="Mã khởi tạo"
              tooltip="Mã ban đầu học viên sẽ thấy"
            >
              <Input.TextArea
                rows={4}
                placeholder="def solve():\n    pass"
                maxLength={2000}
                showCount
              />
            </Form.Item>

            <Form.Item name="notes" label="Ghi chú">
              <Input.TextArea
                rows={2}
                placeholder="Ghi chú thêm cho giáo viên..."
                maxLength={1000}
                showCount
              />
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
          form.resetFields();
          setSelectedType("video");
          setEditingLesson(null);
          setQuizQuestions([]);
          setLessonModalVisible(true);
        }}
        block
        size="middle"
        style={{ marginBottom: 16 }}
      >
        Thêm bài học
      </Button>

      <List
        dataSource={lessons}
        renderItem={(lesson, index) => {
          const badge = getLessonTypeBadge(lesson.type);
          return (
            <List.Item
              key={index}
              actions={[
                <Tooltip title="Chỉnh sửa">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEditLesson(lesson)}
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
                description={lesson.description || "Không có mô tả"}
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
        onOk={handleAddLesson}
        onCancel={() => {
          setLessonModalVisible(false);
          form.resetFields();
          setEditingLesson(null);
          setQuizQuestions([]);
        }}
        width={700}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề bài học"
            rules={[
              { required: true, message: "Vui lòng nhập tiêu đề bài học" },
            ]}
          >
            <Input placeholder="VD: Giới thiệu Python" maxLength={200} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả ngắn"
            tooltip="Mô tả hiển thị trong danh sách bài học"
          >
            <Input.TextArea
              placeholder="Mô tả bài học..."
              rows={2}
              maxLength={255}
              showCount
            />
          </Form.Item>

          <Divider>Loại bài học</Divider>

          <Form.Item label="Chọn loại">
            <Radio.Group
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
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

          <Divider>{getLessonTypeBadge(selectedType).label}</Divider>

          {renderTypeSpecificFields()}
        </Form>
      </Modal>
    </div>
  );
};

export default LessonEditorEnhanced;
