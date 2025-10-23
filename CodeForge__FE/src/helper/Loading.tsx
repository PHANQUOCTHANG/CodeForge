import { Spin } from "antd";
import "./Loading.scss";

const Loading = () => (
  <div className="loading-overlay">
    <Spin size="large" tip="Đang tải dữ liệu..." />
  </div>
);

export default Loading;
