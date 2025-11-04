import React, { useState, useRef } from "react";

import "./CourseDetailPage.scss";
import { useParams } from "react-router-dom";
// Types - Updated to match API response

import { Empty } from "antd";
import {
  calculateDiscount,
  CourseCurriculum,
  CourseHero,
  CourseReviews,
  CourseSidebar,
  useCourseDetail,
  type Review,
} from "@/features";
const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string | undefined }>();

  const {
    data: course, // ✅ 'course' bây giờ sẽ là object data bên trong
    isLoading,
    isError,
    error,
  } = useCourseDetail(slug);
  const reviews: Review[] = course?.reviews || [];
  const [activeTab, setActiveTab] = useState<
    "overview" | "curriculum" | "reviews"
  >("overview");
  const overviewRef = useRef<HTMLDivElement | null>(null);
  const curriculumRef = useRef<HTMLDivElement | null>(null);
  const reviewsRef = useRef<HTMLDivElement | null>(null);
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };
  console.log(course);
  const finalPrice = calculateDiscount(course?.price, course?.discount);
  console.log(course?.price, course?.discount, finalPrice);
  return (
    <>
      {/* Course Grid */}
      {isLoading ? (
        <div className="course-detail-loading">
          <div className="spinner"></div>
          <p>Đang tải khóa học...</p>
        </div>
      ) : isError ? (
        <Empty description={error.message} />
      ) : course == null || course.length === 0 ? (
        <Empty description="Không có khóa học nào" />
      ) : (
        <div className="course-detail-page">
          <div className="course-detail-page__container">
            <div className="course-detail-page__main">
              <CourseHero finalPrice={finalPrice} course={course} />

              {/* Main Content */}
              <div className="course-content">
                <div className="course-content__container">
                  <div className="course-content__main">
                    {/* Tabs */}
                    <div className="course-tabs">
                      <button
                        className={`tab ${
                          activeTab === "overview" ? "active" : ""
                        }`}
                        onClick={() => {
                          setActiveTab("overview");
                          scrollToSection(overviewRef);
                        }}
                      >
                        Tổng quan
                      </button>

                      <button
                        className={`tab ${
                          activeTab === "curriculum" ? "active" : ""
                        }`}
                        onClick={() => {
                          setActiveTab("curriculum");
                          scrollToSection(curriculumRef);
                        }}
                      >
                        Nội dung khóa học
                      </button>

                      <button
                        className={`tab ${
                          activeTab === "reviews" ? "active" : ""
                        }`}
                        onClick={() => {
                          setActiveTab("reviews");
                          scrollToSection(reviewsRef);
                        }}
                      >
                        Đánh giá ({course.totalRatings})
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div className="course-tabs-content">
                      <div
                        ref={overviewRef}
                        className="overview-content"
                        dangerouslySetInnerHTML={{ __html: course.overview }}
                      />

                      <CourseCurriculum
                        curriculumRef={curriculumRef}
                        course={course}
                      />
                      <CourseReviews
                        reviewsRef={reviewsRef}
                        reviews={reviews}
                        totalRatings={course.totalRatings}
                        rating={course.rating}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CourseSidebar
              course={course}
              isEnrolled={course.isEnrolled}
              finalPrice={finalPrice}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CourseDetailPage;
