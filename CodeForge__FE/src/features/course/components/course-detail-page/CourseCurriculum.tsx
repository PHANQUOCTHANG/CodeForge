import React from "react";
import { Collapse } from "antd";
import type { CourseDetail } from "@/features/course/types";
import {
  Award,
  BookOpen,
  Code,
  FileText,
  Video,
  ChevronDown,
  ChevronUp,
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
                {module.lessons.map((lesson) => (
                  <div key={lesson.lessonId} className="lesson-item">
                    <div className="lesson-icon">
                      {getLessonIcon(lesson.lessonType)}
                    </div>
                    <span className="lesson-title">{lesson.title}</span>
                  </div>
                ))}
              </div>
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
};

export default CourseCurriculum;
