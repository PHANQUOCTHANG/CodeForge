import React from "react";
import { Input, Select } from "antd";

interface Props {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  setLevel: (v: string) => void;
  setPage: (v: number) => void;
}

const CourseFilters: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  setLevel,
  setPage,
}) => {
  const handleLevelChange = (e: any) => {
    setLevel(e);
  };
  return (
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
          onChange={handleLevelChange}
          options={[
            { value: "all", label: "Tất cả" },
            { value: "beginner", label: "Cơ bản" },
            { value: "intermediate", label: "Trung bình" },
            { value: "advanced", label: "Nâng cao" },
          ]}
        />
      </nav>
    </div>
  );
};

export default CourseFilters;
