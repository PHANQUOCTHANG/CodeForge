import React, { useState, useRef, useEffect } from "react";
import "./StudyCoursePage.tsx.scss";
const App = () => {
  const [leftWidth, setLeftWidth] = useState(30);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const lessons = [
    {
      id: 1,
      title: "Giới thiệu về máy tính",
      completed: 0,
      total: 9,
      duration: "1 giờ 55 phút",
    },
    {
      id: 2,
      title: "Đơn vị xử lý trung tâm",
      completed: 0,
      total: 8,
      duration: "1 giờ 55 phút",
    },
    {
      id: 3,
      title: "Nguồn điện",
      completed: 0,
      total: 4,
      duration: "0 giờ 55 phút",
    },
    {
      id: 4,
      title: "Bo mạch chính",
      completed: 0,
      total: 3,
      duration: "0 giờ 40 phút",
    },
    {
      id: 5,
      title: "Bộ nhớ RAM/ROM",
      completed: 0,
      total: 9,
      duration: "2 giờ 10 phút",
    },
    {
      id: 6,
      title: "Các cổng kết nối",
      completed: 0,
      total: 11,
      duration: "2 giờ 40 phút",
    },
    {
      id: 7,
      title: "Thiết bị lưu trữ dữ liệu",
      completed: 0,
      total: 10,
      duration: "2 giờ 15 phút",
    },
    {
      id: 8,
      title: "Thiết bị nhập dữ liệu",
      completed: 0,
      total: 8,
      duration: "1 giờ 30 phút",
    },
  ];

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth =
      ((e.clientX - containerRect.left) / containerRect.width) * 100;

    if (newWidth >= 20 && newWidth <= 60) {
      setLeftWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };
  }, [isDragging]);

  return (
    <div className="studyCoursePage" ref={containerRef}>
      <header className="studyCoursePage__header">
        <button className="studyCoursePage__backBtn">
          ← Phần cứng máy tính
        </button>
        {isMobile && (
          <button
            className="studyCoursePage__menuBtn"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            ☰
          </button>
        )}
        {!isMobile && (
          <div className="studyCoursePage__pageNumbers">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                className={`studyCoursePage__pageBtn ${
                  num === 1 ? "studyCoursePage__pageBtn--active" : ""
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="studyCoursePage__content">
        {isMobile ? (
          <>
            <div
              className={`mobileSidebar ${
                showSidebar ? "mobileSidebar--open" : ""
              }`}
            >
              <div className="mobileSidebar__header">
                <h3>Danh sách bài học</h3>
                <button
                  className="mobileSidebar__closeBtn"
                  onClick={() => setShowSidebar(false)}
                >
                  ×
                </button>
              </div>
              <div className="lessonsList">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="lessonsList__item"
                    onClick={() => setShowSidebar(false)}
                  >
                    <div className="lessonsList__header">
                      <span className="lessonsList__chevron">›</span>
                      <span className="lessonsList__title">{lesson.title}</span>
                    </div>
                    <div className="lessonsList__meta">
                      <span className="lessonsList__progress">
                        {lesson.completed}/{lesson.total}
                      </span>
                      <span className="lessonsList__dot">•</span>
                      <span className="lessonsList__duration">
                        {lesson.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {showSidebar && (
              <div
                className="overlay"
                onClick={() => setShowSidebar(false)}
              ></div>
            )}

            <div
              className="studyCoursePage__rightPanel"
              style={{ width: "100%" }}
            >
              <div className="lessonInfo">
                <div className="lessonInfo__badges">
                  <span className="lessonInfo__badge">⚙️ 10 phút</span>
                  <span className="lessonInfo__badge">❓ 1 câu hỏi</span>
                  <span className="lessonInfo__badge">
                    ✏️ Không giới hạn làm lại
                  </span>
                  <span className="lessonInfo__badge">⏱️ 2 phút</span>
                </div>

                <h1 className="lessonInfo__heading">Lý thuyết</h1>

                <div className="lessonInfo__content">
                  <h2>Mục đích</h2>
                  <p>
                    Học viên hiểu được máy tính và phần cứng máy tính là gì.
                  </p>

                  <h2>Giới thiệu về máy tính</h2>
                  <p>
                    Trong thời đại công nghệ thông tin, máy tính được dùng rộng
                    rãi trong các lĩnh vực nghề nghiệp như giáo dục, y tế, giải
                    trí, ngân hàng, kinh doanh, dự báo thời tiết, và nghiên cứu
                    khoa học. Với cá nhân, máy tính giúp chúng ta tìm kiếm thông
                    tin, soạn thảo văn bản, giải trí, liên lạc,.... và rất nhiều
                    việc khác.
                  </p>
                  <p>
                    Máy tính là những thiết bị điện tử hay hệ thống điện tử thực
                    hiện tự động các thao tác toán học, logic học hay đồ hoạ. Có
                    thể hiểu chức năng chính của máy tính là thực hiện tự động
                    quá trình thu thập dữ liệu, lưu trữ và xử lý thông tin, giúp
                    cho người sử dụng giảm bớt đi các công việc thao tác, tính
                    toán phức tạp với dữ liệu.
                  </p>
                  <p>
                    Các máy tính cá nhỏ dung cho cá nhân thường được gọi là máy
                    tính cá nhân (PC - Personal computer).
                  </p>

                  <div className="lessonInfo__imageContainer">
                    <img
                      src="https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&h=400&fit=crop"
                      alt="Computer"
                      className="lessonInfo__image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              className="studyCoursePage__leftPanel"
              style={{ width: `${leftWidth}%` }}
            >
              <div className="lessonsList">
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="lessonsList__item">
                    <div className="lessonsList__header">
                      <span className="lessonsList__chevron">›</span>
                      <span className="lessonsList__title">{lesson.title}</span>
                    </div>
                    <div className="lessonsList__meta">
                      <span className="lessonsList__progress">
                        {lesson.completed}/{lesson.total}
                      </span>
                      <span className="lessonsList__dot">•</span>
                      <span className="lessonsList__duration">
                        {lesson.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="studyCoursePage__resizer"
              onMouseDown={handleMouseDown}
            >
              <div className="studyCoursePage__resizerLine"></div>
            </div>

            <div
              className="studyCoursePage__rightPanel"
              style={{ width: `${100 - leftWidth}%` }}
            >
              <div className="lessonInfo">
                <div className="lessonInfo__badges">
                  <span className="lessonInfo__badge">⚙️ 10 phút</span>
                  <span className="lessonInfo__badge">❓ 1 câu hỏi</span>
                  <span className="lessonInfo__badge">
                    ✏️ Không giới hạn làm lại
                  </span>
                  <span className="lessonInfo__badge">⏱️ 2 phút</span>
                </div>

                <h1 className="lessonInfo__heading">Lý thuyết</h1>

                <div className="lessonInfo__content">
                  <h2>Mục đích</h2>
                  <p>
                    Học viên hiểu được máy tính và phần cứng máy tính là gì.
                  </p>

                  <h2>Giới thiệu về máy tính</h2>
                  <p>
                    Trong thời đại công nghệ thông tin, máy tính được dùng rộng
                    rãi trong các lĩnh vực nghề nghiệp như giáo dục, y tế, giải
                    trí, ngân hàng, kinh doanh, dự báo thời tiết, và nghiên cứu
                    khoa học. Với cá nhân, máy tính giúp chúng ta tìm kiếm thông
                    tin, soạn thảo văn bản, giải trí, liên lạc,.... và rất nhiều
                    việc khác.
                  </p>
                  <p>
                    Máy tính là những thiết bị điện tử hay hệ thống điện tử thực
                    hiện tự động các thao tác toán học, logic học hay đồ hoạ. Có
                    thể hiểu chức năng chính của máy tính là thực hiện tự động
                    quá trình thu thập dữ liệu, lưu trữ và xử lý thông tin, giúp
                    cho người sử dụng giảm bớt đi các công việc thao tác, tính
                    toán phức tạp với dữ liệu.
                  </p>
                  <p>
                    Các máy tính cá nhỏ dung cho cá nhân thường được gọi là máy
                    tính cá nhân (PC - Personal computer).
                  </p>

                  <div className="lessonInfo__imageContainer">
                    <img
                      src="https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&h=400&fit=crop"
                      alt="Computer"
                      className="lessonInfo__image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
