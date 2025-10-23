import React, { useEffect, useState } from "react";
import {
  Input,
  Pagination,
  Select,
  Spin,
  Empty,
  Rate,
  Skeleton,
  Popover,
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { courseApi } from "@/api/courseApi";
import limit from "@/const/const";
import banner from "@/assets/img/banner.png";
import "./CoursePage.scss";

// ======================
// 🧩 Interface
// ======================

interface Course {
  courseID: string;
  title: string;
  slug: string;
  thumbnail: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  status: string;
  price?: number;
  duration?: number;
  rating?: number;
  totalRatings?: number;
  totalStudents?: number;
  discount?: number;
  badge?: string;
  author?: string;
  categoryName?: string;
  lessonCount: number;
}

// ======================
// 📘 Component
// ======================
const CoursePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = Number(searchParams.get("page")) || 1;
  const searchParam = searchParams.get("search") || "";
  const [page, setPage] = useState(pageParam);
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const navigate = useNavigate();

  // ======================
  // 🚀 Fetch Courses (React Query)
  // ======================
  const { data, isLoading, isError } = useQuery({
    queryKey: ["courses", page, searchTerm],
    queryFn: async () => {
      const res = await courseApi.getPaged(page, limit, searchTerm);
      console.log(res);
      return res; // backend trả { data, totalItems }
    },
    keepPreviousData: true,
  });
  useEffect(() => {
    const params: Record<string, string> = {};
    if (page > 1) params.page = String(page);
    if (searchTerm.trim() !== "") params.search = searchTerm;
    setSearchParams(params);
  }, [page, searchTerm]);

  const courses: Course[] = data?.data || [];
  const totalItems = data?.totalItems || 0;

  // ======================
  // ⚙️ Helpers
  // ======================
  const calculateDiscount = (price?: number, discount?: number): number => {
    if (!price || !discount || discount === 0) return 0;
    return Math.round(price - (price * discount) / 100);
  };

  const formatPrice = (price?: number): string => {
    if (price === undefined) return "";
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  // ======================
  // 💡 UI
  // ======================
  return (
    <div className="course-page">
      {/* Banner */}
      <div className="course-page__banner">
        <img src={banner} alt="Banner" />
      </div>

      <div className="course-page__container">
        {/* Filters */}
        <div className="course-page__filters">
          <div className="search-box">
            <Input.Search
              placeholder="Tìm kiếm khóa học..."
              size="large"
              enterButton="Tìm"
              allowClear
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              onSearch={(e) => {
                setSearchTerm(e);
                setPage(1);
              }}
            />
          </div>
          <nav className="filters-nav">
            <Select
              size="large"
              placeholder="Chọn danh mục"
              style={{ width: 200 }}
              options={[
                { value: "all", label: "Tất cả" },
                { value: "beginner", label: "Beginner" },
                { value: "intermediate", label: "Intermediate" },
                { value: "advanced", label: "Advanced" },
              ]}
            />
          </nav>
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div className="course-page__grid">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="course-card">
                {/* Thumbnail */}
                <div className="course-card__thumbnail">
                  <Skeleton.Avatar active shape="square" size={160} />
                  <span className="course-card__fire-icon">🔥</span>
                </div>

                <div className="course-card__content">
                  {/* Badge */}
                  <Skeleton.Input
                    active
                    style={{ width: 60, height: 20, marginBottom: 8 }}
                  />

                  {/* Title */}
                  <Skeleton.Input
                    active
                    style={{ width: "80%", height: 20, marginBottom: 8 }}
                  />

                  {/* Instructor */}
                  <Skeleton.Input
                    active
                    style={{ width: "50%", height: 16, marginBottom: 8 }}
                  />

                  {/* Rating */}
                  <Skeleton
                    active
                    paragraph={false}
                    title={false}
                    style={{ width: 100, marginBottom: 8 }}
                  />

                  {/* Price */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <Skeleton.Input active style={{ width: 80, height: 20 }} />
                    <Skeleton.Input active style={{ width: 60, height: 20 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <Empty description="Lỗi khi tải dữ liệu" />
        ) : courses.length === 0 ? (
          <Empty description="Không có khóa học nào" />
        ) : (
          <>
            <div className="course-page__grid">
              {courses.map((course) => {
                const title = (
                  <span
                    className="course-page__popup--title"
                    key={`title-${course.courseID}`}
                  >
                    Khóa học
                  </span>
                );

                const content = (
                  <div
                    key={`content-${course.courseID}`}
                    style={{ width: 320 }}
                    className="course-page__popup"
                  >
                    <h3>{course.title}</h3>
                    <ul>
                      <li key="duration">{course.duration} giờ</li>
                      <li key="lesson">{course.lessonCount} Bài học</li>
                      <li key="students">{course.totalStudents} học viên</li>
                    </ul>
                    <div
                      dangerouslySetInnerHTML={{ __html: course.description! }}
                    />
                    <div
                      className="course-page__popup--action"
                      style={{ marginTop: 10 }}
                    >
                      {course.price === 0 ? (
                        <button key="free" className="btn btn-primary">
                          Đăng ký miễn phí
                        </button>
                      ) : (
                        <div key="actions">
                          <button key="buy" className="btn btn-primary">
                            Mua ngay
                          </button>
                          <button key="cart" className="btn btn-primary">
                            Thêm vào giỏ hàng
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );

                return (
                  <Popover
                    key={`popover-${course.courseID}`}
                    placement="left"
                    content={content}
                    title={title}
                    trigger="hover"
                  >
                    <div
                      onClick={() => navigate(`/courses/${course.slug}`)}
                      className="course-card"
                    >
                      <div className="course-card__thumbnail">
                        <img src={course.thumbnail} alt={course.title} />
                        <span className="course-card__fire-icon">🔥</span>
                      </div>

                      <div className="course-card__content">
                        <div className="course-card__category">
                          {course.badge || "Khóa học"}
                        </div>
                        <h3 className="course-card__title">{course.title}</h3>
                        <div className="course-card__instructor">
                          {course.author}
                        </div>

                        <div className="course-card__rating">
                          <Rate
                            allowHalf
                            disabled
                            defaultValue={course.rating}
                          />
                          <span className="course-card__rating-value">
                            {course.rating || 0}
                          </span>
                        </div>

                        <div className="course-card__footer">
                          <div className="course-card__price-section">
                            <div className="course-card__price">
                              {course.price === 0
                                ? "Miễn phí"
                                : formatPrice(
                                    calculateDiscount(
                                      course.price,
                                      course.discount
                                    )
                                  )}
                            </div>
                            {course.discount > 0 && (
                              <>
                                <div>
                                  <span className="course-card__original-price">
                                    {formatPrice(course.price)}
                                  </span>
                                  <span className="course-card__discount">
                                    -{course.discount}%
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Popover>
                );
              })}
            </div>

            <div className="pagination-wrapper">
              <Pagination
                align="center"
                current={page}
                total={totalItems}
                pageSize={limit}
                onChange={(newPage) => setPage(newPage)}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CoursePage;
