import { Tooltip, Badge } from "antd";
import {
  FileTextOutlined,
  UnorderedListOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const LessonSidebar = () => {
  const [active, setActive] = useState("content");

  const items = [
    { key: "content", icon: <FileTextOutlined />, label: "Nội dung" },
    { key: "list", icon: <UnorderedListOutlined />, label: "Danh sách bài" },
    { key: "progress", icon: <ClockCircleOutlined />, label: "Tiến độ học" },
    { key: "chat", icon: <MessageOutlined />, label: "Thảo luận", badge: 111 },
    { key: "help", icon: <QuestionCircleOutlined />, label: "Trợ giúp" },
  ];

  return (
    <aside className="lesson-page__sidebar">
      <ul className="lesson-page__sidebar-list">
        {items.map((item) => (
          <Tooltip placement="right" title={item.label}>
            <li
              key={item.key}
              className={`lesson-page__sidebar-item ${
                active === item.key ? "lesson-page__sidebar-item--active" : ""
              } ${item.badge ? "lesson-page__sidebar-item--has-badge" : ""}`}
              onClick={() => setActive(item.key)}
            >
              <div className="lesson-page__sidebar-icon">
                {item.badge ? (
                  <Badge count={item.badge} size="small" offset={[6, 0]}>
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </div>
            </li>
          </Tooltip>
        ))}
      </ul>
    </aside>
  );
};

export default LessonSidebar;
