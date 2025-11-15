import React from "react";
import {
  Card,
  Avatar,
  Button,
  Input,
  Tag,
  Divider,
  List,
  Typography,
} from "antd";
import {
  PlusOutlined,
  LikeOutlined,
  CommentOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import "./CommunityPage.scss";

const { TextArea } = Input;
const { Title, Text } = Typography;

const posts = [
  {
    id: 1,
    author: "Sarah Chen",
    avatar: "/src/assets/img/avatar1.jpg",
    role: "JavaScript Expert",
    time: "2 hours ago",
    content:
      "Just completed my first React project! 🚀 A todo-app with full CRUD operations. The useState and useEffect hooks finally clicked for me.",
    image:
      "/src/assets/img/CommunityPage1.jpg",
    tags: ["React", "Beginner", "Project"],
    likes: 24,
    comments: 8,
    shares: 4,
  },
  {
    id: 2,
    author: "Mike Rodriguez",
    avatar: "/src/assets/img/avatar2.jpg",
    role: "Python Guru",
    time: "4 hours ago",
    content:
      "Quick tip for Python beginners 🐍: Use list comprehensions to make your code more pythonic! Instead of writing loops, try [x*2 for x in range(10)] 💡",
    tags: ["Python", "Best Practices"],
    likes: 45,
    comments: 12,
    shares: 5,
  },
  {
    id: 3,
    author: "Emma Wilson",
    avatar: "/src/assets/img/avatar3.jpg",
    role: "CSS Artist",
    time: "6 hours ago",
    content:
      "Spent the weekend learning CSS Grid and I’m blown away! 🎨 Finally understand how to create complex layouts without floats.",
    image:
      "/src/assets/img/CommunityPage2.jpg",
    tags: ["CSS", "Grid", "Layout"],
    likes: 28,
    comments: 10,
    shares: 3,
  },
];

const CommunityPage: React.FC = () => {
  return (
    <div className="community-container" style={{ display: "flex", gap: "24px", padding: "40px" }}>
      {/* LEFT CONTENT */}
      <div className="main-content" style={{ flex: 3 }}>
        <Card>
          <Title level={3}>Community Hub 🌟</Title>
          <Text type="secondary">
            Connect, learn, and grow together with fellow developers
          </Text>

          <Divider />

          {/* Create Post */}
          <Card bordered={true} style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "12px" }}>
              <Avatar size={48} src="/src/assets/img/avatar1.jpg" />
              <div style={{ flex: 1 }}>
                <TextArea
                  rows={3}
                  placeholder="Share your coding journey, ask questions, or celebrate wins! ✨"
                  style={{ marginBottom: "10px" }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Tag color="blue">#javascript</Tag>
                    <Tag color="green">#help</Tag>
                    <Tag color="orange">#project</Tag>
                  </div>
                  <Button type="primary" icon={<PlusOutlined />}>
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Posts List */}
          <List
            dataSource={posts}
            renderItem={(post) => (
              <Card key={post.id} style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <Avatar size={48} src={post.avatar} />
                  <div>
                    <strong>{post.author}</strong>{" "}
                    <Tag color="geekblue">{post.role}</Tag>
                    <div style={{ color: "#888", fontSize: "12px" }}>{post.time}</div>
                  </div>
                </div>
                <p>{post.content}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="post"
                    className="post-image"
                    style={{
                      width: "50%",
                      borderRadius: "10px",
                      marginBottom: "10px",
                    }}
                  />
                )}
                <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                  {post.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
                <div className="interaction-bar" style={{ display: "flex", gap: "16px", color: "#888" }}>
                  <span>
                    <LikeOutlined /> {post.likes}
                  </span>
                  <span>
                    <CommentOutlined /> {post.comments}
                  </span>
                  <span>
                    <ShareAltOutlined /> {post.shares}
                  </span>
                </div>
              </Card>
            )}
          />

          <Button block>Load More Posts</Button>
        </Card>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="sidebar" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
        <Input.Search placeholder="Search community..." allowClear />

        <Card title="🔥 Trending Topics">
          <ul>
            <li>#react-hooks — 156 posts</li>
            <li>#python-tips — 87 posts</li>
            <li>#css-grid — 47 posts</li>
            <li>#javascript-es6 — 41 posts</li>
          </ul>
        </Card>

        <Card title="📅 Upcoming Events">
          <p>
            <strong>JavaScript Study Group</strong> <br />
            Tomorrow • 7 PM
          </p>
          <Button size="small">Join</Button>
          <Divider />
          <p>
            <strong>Python Web Dev Workshop</strong> <br />
            Saturday • 9 AM
          </p>
          <Button size="small">Join</Button>
        </Card>

        <Card title="🏆 Top Contributors">
          <ul>
            <li>Alex Chen (+103)</li>
            <li>Sarah Kim (+92)</li>
            <li>Jordan Lee (+80)</li>
            <li>Yoo (+45)</li>
            <li>Chris Park (+40)</li>
          </ul>
        </Card>

        <Card title="💡 Community Actions">
          <Button block>Find Study Buddies</Button>
          <Button block>Create Event</Button>
          <Button block>Ask Question</Button>
        </Card>
      </div>
    </div>
  );
};

export default CommunityPage;
