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
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./LessonEditor.scss";

export type LessonType = "video" | "text" | "quiz" | "coding";

export interface LessonBase {
  lessonId?: string;
  title: string;
  description?: string;
  orderIndex: number;
  type: LessonType;
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
  title: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizLesson extends LessonBase {
  type: "quiz";
  questions: QuizQuestion[];
}

export interface CodingLesson extends LessonBase {
  type: "coding";
  problemId?: string;
  description: string;
  initialCode?: string;
  language: string;
}

export type Lesson = VideoLesson | TextLesson | QuizLesson | CodingLesson;

interface LessonEditorProps {
  moduleId: string;
  lessons: Lesson[];
  onLessonsChange: (lessons: Lesson[]) => void;
}

const LessonEditor: React.FC<LessonEditorProps> = ({
  moduleId,
  lessons,
  onLessonsChange,
}) => {
  const [lessonModalVisible, setLessonModalVisible] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedType, setSelectedType] = useState<LessonType>("video");
  const [form] = Form.useForm();

  const handleAddLesson = async () => {
    try {
      const values = await form.validateFields();

      if (editingLesson) {
        onLessonsChange(
          lessons.map((l) =>
            l.orderIndex === editingLesson.orderIndex
              ? {
                  ...values,
                  orderIndex: editingLesson.orderIndex,
                  type: selectedType,
                }
              : l
          )
        );
        message.success("Cập nhật bài học thành công");
      } else {
        const newLesson: Lesson = {
          ...values,
          orderIndex: lessons.length + 1,
          type: selectedType,
        };
        onLessonsChange([...lessons, newLesson]);
        message.success("Thêm bài học thành công");
      }

      setLessonModalVisible(false);
      setEditingLesson(null);
      form.resetFields();
      setSelectedType("video");
    } catch {
      message.error("Vui lòng điền đủ thông tin bài học");
    }
  };

  const handleDeleteLesson = (orderIndex: number) => {
    onLessonsChange(lessons.filter((l) => l.orderIndex !== orderIndex));
    message.success("Xóa bài học thành công");
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setSelectedType(lesson.type);
    setLessonModalVisible(true);
    form.setFieldsValue(lesson);
  };

  const handleCloseModal = () => {
    setLessonModalVisible(false);
    setEditingLesson(null);
    form.resetFields();
    setSelectedType("video");
  };

  const renderLessonContent = () => {
    switch (selectedType) {
      case "video":
        return (
          <Form.Item
            name="videoUrl"
            label="Video URL"
            rules={[{ required: true, message: "Vui lòng nhập URL video" }]}
          >
            <Input placeholder="https://youtube.com/watch?v=..." />
          </Form.Item>
        );

      case "text":
        return (
          <Form.Item
            name="content"
            label="Nội dung bài học"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <Input.TextArea rows={6} placeholder="Nhập nội dung bài học..." />
          </Form.Item>
        );

      case "quiz":
        return (
          <div>
            <Form.Item label="Câu hỏi trắc nghiệm">
              <Button type="dashed" block icon={<PlusOutlined />}>
                Thêm câu hỏi (chưa hỗ trợ inline)
              </Button>
            </Form.Item>
            <p style={{ color: "#999", fontSize: 12 }}>
              Tính năng quản lý câu hỏi sẽ được cải tiến
            </p>
          </div>
        );

      case "coding":
        return (
          <>
            <Form.Item
              name="description"
              label="Mô tả bài toán"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Mô tả chi tiết bài toán..."
              />
            </Form.Item>

            <Form.Item
              name="language"
              label="Ngôn ngữ lập trình"
              rules={[{ required: true, message: "Vui lòng chọn ngôn ngữ" }]}
            >
              <Select>
                <Select.Option value="python">Python</Select.Option>
                <Select.Option value="javascript">JavaScript</Select.Option>
                <Select.Option value="cpp">C++</Select.Option>
                <Select.Option value="java">Java</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="initialCode"
              label="Mã khởi tạo"
              tooltip="Mã tự động điền khi người dùng bắt đầu bài tập"
            >
              <Input.TextArea
                rows={4}
                placeholder="def solution():&#10;    pass"
              />
            </Form.Item>
          </>
        );

      default:
        return null;
    }
  };

  const getLessonTypeLabel = (type: LessonType): string => {
    const labels: Record<LessonType, string> = {
      video: "📹 Video",
      text: "📝 Văn bản",
      quiz: "❓ Trắc nghiệm",
      coding: "💻 Lập trình",
    };
    return labels[type];
  };

  return (
    <div className="lesson-editor-container">
      <Card title={`Bài học trong Module: ${moduleId}`} bordered={false}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingLesson(null);
            setLessonModalVisible(true);
            form.resetFields();
            setSelectedType("video");
          }}
          style={{ marginBottom: 16 }}
        >
          Thêm Bài Học
        </Button>

        <List
          dataSource={lessons}
          renderItem={(lesson, index) => (
            <List.Item
              key={lesson.orderIndex}
              actions={[
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleEditLesson(lesson)}
                />,
                <Popconfirm
                  title="Xóa bài học?"
                  onConfirm={() => handleDeleteLesson(lesson.orderIndex)}
                >
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={`${index + 1}. ${lesson.title}`}
                description={
                  <>
                    <span className="lesson-type">
                      {getLessonTypeLabel(lesson.type)}
                    </span>
                    {lesson.description && (
                      <span className="lesson-description">
                        {" · "}
                        {lesson.description.substring(0, 60)}...
                      </span>
                    )}
                  </>
                }
              />
            </List.Item>
          )}
        />

        {lessons.length === 0 && (
          <div className="empty-state">
            Chưa có bài học nào. Hãy thêm bài học mới để bắt đầu.
          </div>
        )}
      </Card>

      {/* Lesson Modal */}
      <Modal
        title={editingLesson ? "Chỉnh sửa bài học" : "Thêm bài học mới"}
        open={lessonModalVisible}
        onCancel={handleCloseModal}
        onOk={handleAddLesson}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề bài học"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input placeholder="VD: Giới thiệu Python cơ bản" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả ngắn"
            rules={[{ required: false }]}
          >
            <Input.TextArea
              rows={2}
              placeholder="Mô tả ngắn gọn về bài học..."
            />
          </Form.Item>

          <Divider style={{ margin: "16px 0" }} />

          <Form.Item label="Loại bài học" required>
            <Radio.Group
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                form.resetFields([
                  "videoUrl",
                  "content",
                  "description",
                  "language",
                  "initialCode",
                ]);
              }}
            >
              <Radio.Button value="video">📹 Video</Radio.Button>
              <Radio.Button value="text">📝 Văn bản</Radio.Button>
              <Radio.Button value="quiz">❓ Trắc nghiệm</Radio.Button>
              <Radio.Button value="coding">💻 Lập trình</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Divider style={{ margin: "16px 0" }} />

          {renderLessonContent()}
        </Form>
      </Modal>
    </div>
  );
};

export default LessonEditor;
