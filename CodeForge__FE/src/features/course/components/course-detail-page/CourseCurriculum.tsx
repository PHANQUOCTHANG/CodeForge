import React from "react";
import { Collapse, Tooltip } from "antd";
import { Link } from "react-router-dom";
import type { CourseDetail } from "@/features/course/types";
import {
  Award,
  BookOpen,
  Code,
  FileText,
  Video,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  LockKeyhole,
} from "lucide-react";

const { Panel } = Collapse;

interface Props {
  curriculumRef: React.RefObject<HTMLDivElement | null>;
  course: CourseDetail;
}

const getLessonIcon = (type: string) => {
  switch (type) {
    case "video":
      return <Video size={18} />;
    case "text":
      return <FileText size={18} />;
    case "coding":
      return <Code size={18} />;
    case "quiz":
      return <Award size={18} />;
    default:
      return <BookOpen size={18} />;
  }
};

const CourseCurriculum: React.FC<Props> = ({ curriculumRef, course }) => {
  return (
    <div className="curriculum-content" ref={curriculumRef}>
      <div className="curriculum-header">
        <h2>Nội dung khóa học</h2>
        <p>
          {course.modules.length} chương •{" "}
          {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} bài học
        </p>
      </div>

      <Collapse
        accordion
        bordered={false}
        expandIconPosition="end"
        expandIcon={({ isActive }) =>
          isActive ? <ChevronUp size={18} /> : <ChevronDown size={18} />
        }
        className="modules-list"
      >
        {course.modules.map((module) => {
          const lessonTypeCount = module.lessons.reduce(
            (acc: Record<string, number>, lesson) => {
              acc[lesson.lessonType] = (acc[lesson.lessonType] || 0) + 1;
              return acc;
            },
            {}
          );

          const typeSummary = Object.entries(lessonTypeCount)
            .map(([type, count]) => `${count} ${type}`)
            .join(" · ");

          return (
            <Panel
              key={module.moduleId}
              header={
                <div className="module-header">
                  <div>
                    <h3 className="module-title">
                      Chương {module.orderIndex}: {module.title}
                    </h3>
                    <span className="lesson-count">
                      {module.lessons.length} bài học ({typeSummary})
                    </span>
                  </div>
                </div>
              }
            >
              <div className="lessons-list">
                {module.lessons.map((lesson) => {
                  const isEnrolled = course.isEnrolled;
                  const lessonPath = `/courses/${course.slug}/learn/${module.moduleId}/${lesson.lessonId}`;
                  const isCompleted = lesson.isCompleted;
                  const lessonContent = (
                    <>
                      <div className="lesson-icon">
                        {getLessonIcon(lesson.lessonType)}
                      </div>
                      <span className="lesson-title">{lesson.title}</span>
                    </>
                  );

                  return (
                    <div
                      key={lesson.lessonId}
                      className={`lesson-item ${
                        isEnrolled ? "active" : "disabled"
                      } ${isCompleted ? "completed" : ""}`}
                    >
                      {isEnrolled ? (
                        <Link to={lessonPath} className="lesson-link">
                          {lessonContent}
                          {isCompleted && (
                            <CheckCircle size={16} color="#22c55e" />
                          )}
                        </Link>
                      ) : (
                        <div className="lesson-locked">
                          {lessonContent}
                          <Tooltip
                            placement="top"
                            title="Bạn cần đăng ký khóa học để mở khóa bài học này."
                          >
                            <LockKeyhole color="gray" />
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
};

export default CourseCurriculum;
