import React, { useState, useEffect, useCallback } from "react";
import Swal from 'sweetalert2';
import {
  Card,
  Avatar,
  Button,
  Input,
  Tag,
  Divider,
  List,
  Typography,
  message,
  Spin,
  Empty,
  Modal,
  Pagination,
  Select,
  Tooltip,
  Space,
} from "antd";
import {
  PlusOutlined,
  LikeOutlined,
  LikeFilled,
  CommentOutlined,
  ShareAltOutlined,
  DeleteOutlined,
  PictureOutlined,
  SearchOutlined,
  SendOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "./CommunityPage.scss";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;
const MySwal = Swal.mixin({});
// ===========================
// TypeScript Interfaces
// ===========================
interface Thread {
  userID: string;
  threadID: string;
  author: string;
  authorID: string;
  avatar: string;
  role: string;
  content: string;
  title: string;
  timeAgo: string;
  imageUrl?: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean; // Client-side state
  commentsList?: Comment[];
  updatedTimeAgo?: string | null;
  timeAgoUpdate?: string | null;
  UpdateAt?: string | null
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

interface CreateThreadDto {
  userId: string;
  title: string;
  content: string;
  imageUrl?: string;
  tags: string[];
}

// ===========================
// Component
// ===========================
const CommunityPage: React.FC = () => {
  // State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [threadToDelete, setThreadToDelete] = useState<string | null>(null);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [threadToEdit, setThreadToEdit] = useState<Thread | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [updating, setUpdating] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Comment
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [visibleComments, setVisibleComments] = useState<{ [key: string]: boolean }>({});

  // Config
  const { 
      isAuthenticated, 
      CURRENT_USER_ID, 
      CURRENT_USER_NAME, 
      CURRENT_USER_AVATAR 
  } = useAuthUser();

  const API_BASE_URL = "http://localhost:5000/api";

  const availableTags = [
    "javascript",
    "react",
    "typescript",
    "webdev",
    "frontend",
    "backend",
    "fullstack",
    "css",
    "html",
    "nodejs",
    "python",
    "java",
    "csharp",
    "beginner",
  ];

  // ===========================
  // Format Time Ago - Tính chính xác
  // ===========================
  const formatTimeAgo = (timeAgo: string): string => {
    // Parse từ BE: "X hours ago"
    const match = timeAgo.match(/(\d+)\s*hours?\s*ago/i);
    if (match) {
      const hours = parseInt(match[1]);
      
      if (hours < 1) {
        return "Just now";
      } else if (hours < 24) {
        return `${hours} hours ago`;
      } else {
        const days = Math.floor(hours / 24);
        if (days === 1) return "1 day ago";
        if (days < 7) return `${days} days ago`;
        if (days < 30) {
          const weeks = Math.floor(days / 7);
          return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
        }
        const months = Math.floor(days / 30);
        return months === 1 ? "1 month ago" : `${months} months ago`;
      }
    }
    return timeAgo;
  };

  // ===========================
  // Load Threads from BE
  // ===========================
  const loadThreads = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Thread[]>(`${API_BASE_URL}/Thread`);
      
      // Initialize client-side states + format time
      const threadsWithState = response.data.map(thread => ({
        ...thread,
        threadID: thread.threadID,
        authorID: thread.userID,
        timeAgo: formatTimeAgo(thread.timeAgo), 
        updatedTimeAgo: thread.timeAgoUpdate && thread.timeAgoUpdate !== thread.timeAgo
        ? formatTimeAgo(thread.timeAgoUpdate)
        : null,
        isLiked: false,
        commentsList: [],
      }));
      
      setThreads(threadsWithState);
      setFilteredThreads(threadsWithState);
    } catch (error: any) {
      console.error("Load threads failed:", error);
      message.error("Failed to load threads!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  // ===========================
  // Search & Filter Logic
  // ===========================
  useEffect(() => {
    let result = [...threads];

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.content.toLowerCase().includes(query) ||
          t.author.toLowerCase().includes(query) ||
          t.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by tag
    if (selectedTagFilter !== "all") {
      result = result.filter((t) => t.tags.includes(selectedTagFilter));
    }

    // Sort
    if (sortBy === "latest") {
      result.sort((a, b) => {
        // Assuming newer threads appear first from API
        return 0;
      });
    } else if (sortBy === "popular") {
      result.sort((a, b) => b.likes - a.likes);
    }

    setFilteredThreads(result);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchQuery, selectedTagFilter, sortBy, threads]);

  // ===========================
  // Pagination Logic
  // ===========================
  const paginatedThreads = filteredThreads.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // ===========================
  // Toggle Tag Selection
  // ===========================
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleEditTag = (tag: string) => {
    setEditTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // ===========================
  // Create New Thread
  // ===========================
  const handlePost = async () => {
    // ✅ FIX 1: Kiểm tra trạng thái xác thực
    if (!isAuthenticated || !CURRENT_USER_ID) {
      await MySwal.fire({
        icon: 'error',
        title: 'Please log in to create a post!',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
      return;
    }
    
    if (!title.trim() || !content.trim()) {
        await MySwal.fire({
          icon: 'warning',
          title: 'Please enter title and content!',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
        return;
    }

    setPosting(true);

    try {
      const payload: CreateThreadDto = {
        // ✅ FIX 2: SỬ DỤNG ID user đã đăng nhập
        userId: CURRENT_USER_ID, 
        title: title.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim() || undefined,
        tags: selectedTags,
      };

      // QUAN TRỌNG: Cần có Access Token trong Authorization Header.
      await axios.post(`${API_BASE_URL}/Thread`, payload); 

      await MySwal.fire({
        icon: 'success',
        title: 'Post published successfully! 🎉',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
      // Reset form
      setTitle("");
      setContent("");
      setImageUrl("");
      setSelectedTags([]);
      loadThreads(); // Tải lại danh sách
    } catch (error: any) {
      console.error("Lỗi đăng bài:", error);
      MySwal.fire({
        icon: 'error',
        title: 'Failed to post!',
        text: error.response?.data?.message || error.message,
      });
    } finally {
      setPosting(false);
    }
  };

  // ===========================
  // Like Thread - Call API
  // ===========================
  const handleLike = async (threadId: string) => {
    if (!isAuthenticated || !CURRENT_USER_ID) {
        await MySwal.fire({
          icon: 'warning',
          title: 'Please log in to interact!',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
        return;
    }

    const originalThread = threads.find(t => t.threadID === threadId);
    if (!originalThread) return;

    // 🔥 Optimistic: chuyển trạng thái trước
    const newLikedState = !originalThread.isLiked;

    setThreads(prev =>
        prev.map(t =>
            t.threadID === threadId
                ? {
                      ...t,
                      isLiked: newLikedState,
                      likes: newLikedState ? t.likes + 1 : t.likes - 1
                  }
                : t
        )
    );

    try {
        const token = localStorage.getItem("accessToken");

        await axios.post(
            `${API_BASE_URL}/Thread/${threadId}/like`,
            {
                threadId,
                userId: CURRENT_USER_ID,
            },
            {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : {},
            }
        );
    } catch (error) {
        console.error("Like failed:", error);

        // 🔥 Revert UI khi lỗi
        setThreads(prev =>
            prev.map(t =>
                t.threadID === threadId
                    ? {
                          ...t,
                          isLiked: originalThread.isLiked,
                          likes: originalThread.likes,
                      }
                    : t
            )
        );

        message.error("Có lỗi xảy ra, không thể tương tác.");
    }
};
  // ===========================
  // Toggle Comments Section
  // ===========================
  const toggleComments = (threadId: string) => {
    setVisibleComments((prev) => ({
      ...prev,
      [threadId]: !prev[threadId],
    }));
  };

  // ===========================
  // Add Comment
  // ===========================
  const handleAddComment = (threadId: string) => {
    const commentText = commentInputs[threadId]?.trim();

    if (!commentText) {
      message.warning("Please enter comment content!");
      return;
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      author: CURRENT_USER_NAME,
      avatar: CURRENT_USER_AVATAR,
      content: commentText,
      timestamp: "Just now",
    };

    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.threadID === threadId) {
          return {
            ...thread,
            comments: thread.comments + 1,
            commentsList: [...(thread.commentsList || []), newComment],
          };
        }
        return thread;
      })
    );

    setCommentInputs((prev) => ({
      ...prev,
      [threadId]: "",
    }));

    message.success("Comment added!");

    // TODO: Call API to persist comment
    // await axios.post(`${API_BASE_URL}/Thread/${threadId}/comment`, { content: commentText });
  };

  // ===========================
  // Delete Thread
  // ===========================
  const handleDelete = async (threadId: string) => {
    if (!isAuthenticated || !CURRENT_USER_ID) {
        await MySwal.fire({
          icon: 'error',
          title: 'Please log in to delete this post!',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
        return;
    }

    const thread = threads.find(t => t.threadID === threadId);

    if (!thread) {
        MySwal.fire({
          icon: 'error',
          title: 'Post not found.',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
        return;
    }

    // FIX: ép về string + lowercase để so sánh chuẩn
    if (String(thread.authorID).toLowerCase() !== 
        String(CURRENT_USER_ID).toLowerCase()) {
        await MySwal.fire({
          icon: 'error',
          title: 'You can only delete your own posts!',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
        return;
    }

    try {
        const token = localStorage.getItem("accessToken");

        await axios.delete(`${API_BASE_URL}/Thread/${threadId}`, {
            data: { userId: CURRENT_USER_ID },
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        await MySwal.fire({
        icon: 'success',
        title: 'Post deleted successfully! 🗑️',
        showConfirmButton: false,
        timer: 1200,
        timerProgressBar: true,
      });
        loadThreads();

    } catch (error: any) {
        console.error(error);
    } finally {
        setDeleteModalVisible(false);
        setThreadToDelete(null);
    }
};
const openEditModal = (thread: Thread) => {
  if (!isAuthenticated || !CURRENT_USER_ID) {
    MySwal.fire({
      icon: "warning",
      title: "Please log in to edit!",
      timer: 1500,
      showConfirmButton: false,
    });
    return;
  }

  if (String(thread.authorID).toLowerCase() !== String(CURRENT_USER_ID).toLowerCase()) {
    MySwal.fire({
      icon: "error",
      title: "You can only edit your own posts!",
      timer: 1500,
      showConfirmButton: false,
    });
    return;
  }

  // Inject vào modal
  setThreadToEdit(thread);
  setEditTitle(thread.title);
  setEditContent(thread.content);
  setEditImageUrl(thread.imageUrl || "");
  setEditTags([...thread.tags]);   // copy để tránh mutate
  setEditModalVisible(true);
};
// Thêm hàm này (sau openEditModal)
const handleUpdate = async () => {
  if (!threadToEdit || !isAuthenticated || !CURRENT_USER_ID) {
    MySwal.fire({
      icon: "error",
      title: "Unable to update post!",
      timer: 1500,
      showConfirmButton: false,
    });
    return;
  }

  if (!editTitle.trim() || !editContent.trim()) {
    MySwal.fire({
      icon: "warning",
      title: "Please enter title and content!",
      timer: 1500,
      showConfirmButton: false,
    });
    return;
  }

  setUpdating(true);

  const token = localStorage.getItem("accessToken");

  try {
    const payload = {
      userId: CURRENT_USER_ID,
      title: editTitle.trim(),
      content: editContent.trim(),
      imageUrl: editImageUrl.trim() || undefined,
      tags: editTags,
    };

    const res = await axios.put(
      `${API_BASE_URL}/Thread/${threadToEdit.threadID}`,
      payload,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );

    const updatedThread = res.data;

    // Cập nhật trực tiếp state threads
    setThreads(prevThreads =>
      prevThreads.map(t =>
        t.threadID === updatedThread.threadID
          ? { ...t, ...updatedThread } // merge tất cả dữ liệu mới
          : t
      )
    );

    await MySwal.fire({
      icon: "success",
      title: "Post updated successfully! ✏️",
      timer: 1500,
      showConfirmButton: false,
    });

    setEditModalVisible(false);
    setThreadToEdit(null);

  } catch (error: any) {
    MySwal.fire({
      icon: "error",
      title: "Failed to update!",
      text: error.response?.data?.message || error.message,
    });
  } finally {
    setUpdating(false);
  }
};


  // ===========================
  // Get unique tags from all threads
  // ===========================
  const allTags = Array.from(
    new Set(threads.flatMap((t) => t.tags))
  );

  // ===========================
  // Render
  // ===========================
  return (
    <motion.div
      className="community-container"
      style={{
        display: "flex",
        gap: "24px",
        padding: "40px",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ===========================
          LEFT: Main Content
          =========================== */}
      <div className="main-content" style={{ flex: 3 }}>
        <Card>
          <Title level={3}>Community Hub 🌟</Title>
          <Text type="secondary">
            Connect, learn, and grow together with fellow developers
          </Text>

          <Divider />

          {/* ===========================
              Filter Bar (chỉ giữ lại Sort và Result count)
              =========================== */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: "20px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Select
                style={{ minWidth: "180px" }}
                value={sortBy}
                onChange={setSortBy}
              >
                <Option value="latest">🆕 Latest</Option>
                <Option value="popular">🔥 Most Popular</Option>
              </Select>

              <Text type="secondary">
                Showing <strong>{filteredThreads.length}</strong> posts
              </Text>
            </div>
          </motion.div>

          {/* ===========================
              Create Post Form
              =========================== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card
              bordered={true}
              style={{ marginBottom: "20px", backgroundColor: "#fafafa" }}
            >
              <div style={{ display: "flex", gap: "12px" }}>
                <Avatar size={48} src={CURRENT_USER_AVATAR} />

                <div style={{ flex: 1 }}>
                  <Input
                    placeholder="Post title (required)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={255}
                    showCount
                    style={{ marginBottom: "10px" }}
                  />

                  <TextArea
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your coding journey, ask questions, or celebrate wins! ✨"
                    style={{ marginBottom: "10px" }}
                  />

                  <Input
                    placeholder="Image URL (optional)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    prefix={<PictureOutlined />}
                    style={{ marginBottom: "10px" }}
                  />

                  <div style={{ marginBottom: "10px" }}>
                    <Text strong style={{ marginRight: "8px" }}>
                      Tags:
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                        marginTop: "8px",
                      }}
                    >
                      {availableTags.map((tag) => (
                        <Tag
                          key={tag}
                          color={selectedTags.includes(tag) ? "blue" : "default"}
                          style={{ cursor: "pointer", userSelect: "none" }}
                          onClick={() => toggleTag(tag)}
                        >
                          #{tag}
                        </Tag>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      loading={posting}
                      onClick={handlePost}
                      size="large"
                    >
                      {posting ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* ===========================
              Threads List
              =========================== */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Spin size="large" tip="Loading posts..." />
            </div>
          ) : filteredThreads.length === 0 ? (
            <Empty
              description={
                searchQuery || selectedTagFilter !== "all"
                  ? "No matching posts found"
                  : "No posts yet. Be the first to post! 🚀"
              }
            />
          ) : (
            <>
              <List
                dataSource={paginatedThreads}
                renderItem={(thread: Thread, index) => (
                  <motion.div
                    key={thread.threadID}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card
                      style={{ marginBottom: "20px" }}
                      actions={[
                        <Tooltip 
                          key="like" 
                          title={thread.isLiked ? "Unlike" : "Like"}
                        >
                          <span
                            onClick={() => handleLike(thread.threadID)}
                            style={{ cursor: "pointer" }}
                          >
                            {thread.isLiked ? (
                              <LikeFilled style={{ color: "#1890ff" }} />
                            ) : (
                              <LikeOutlined />
                            )}{" "}
                            {thread.likes}
                          </span>
                        </Tooltip>,
                        <Tooltip key="comment" title="Comment">
                          <span
                            onClick={() => toggleComments(thread.threadID)}
                            style={{ cursor: "pointer" }}
                          >
                            <CommentOutlined /> {thread.comments}
                          </span>
                        </Tooltip>,
                        <Tooltip key="share" title="Share">
                          <span style={{ cursor: "pointer" }}>
                            <ShareAltOutlined /> {thread.shares}
                          </span>
                        </Tooltip>,
                        <Tooltip key="edit" title="Edit">
                        <span
                          onClick={() => openEditModal(thread)}
                          style={{ cursor: "pointer", color: "#1890ff" }}
                        >
                          <EditOutlined /> Edit
                        </span>
                      </Tooltip>,
                        <Tooltip key="delete" title="Delete">
                          <span
                          onClick={() =>
                            MySwal.fire({
                            title: "Are you sure?",
                            text: "You won't be able to revert this!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#ff4d4f",
                            cancelButtonColor: "#d9d9d9",
                            confirmButtonText: "Delete",
                            cancelButtonText: "Cancel",
                            reverseButtons: true,
                            }).then((result) => {
                            if (result.isConfirmed) {
                              handleDelete(thread.threadID);
                            }
                            })
                          }
                          style={{ cursor: "pointer", color: "#ff4d4f" }}
                          >
                          <DeleteOutlined /> Delete
                          </span>
                        </Tooltip>,
                      ]}
                    >
                      {/* Author Info */}
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginBottom: "12px",
                        }}
                      >
                        <Avatar
                          size={48}
                          src={thread.avatar || "/src/assets/default.png"}
                        />
                        <div>
                          <div>
                            <strong>{thread.author}</strong>{" "}
                            <Tag color="geekblue">{thread.role}</Tag>
                          </div>
                          <div style={{ fontSize: 12, color: "#555" }}>
                          {thread.timeAgo}
                          {thread.timeAgoUpdate && (
                            <span style={{ color: "#aaa", fontStyle: "italic", marginLeft: 4 }}>
                              - {thread.timeAgoUpdate}
                            </span>
                          )}
                        </div>
                        </div>
                      </div>

                      {/* Title */}
                      <Title level={4} style={{ marginBottom: "8px" }}>
                        {thread.title}
                      </Title>

                      {/* Content */}
                      <Text>{thread.content}</Text>

                      {/* Image */}
                      {thread.imageUrl && (
                        <div style={{ marginTop: "12px" }}>
                          <img
                            src={thread.imageUrl}
                            alt="Thread image"
                            style={{
                              width: "100%",
                              maxHeight: "400px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                      )}

                      {/* Tags */}
                      {thread.tags && thread.tags.length > 0 && (
                        <div
                          style={{
                            marginTop: "12px",
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          {thread.tags.map((tag: string, idx: number) => (
                            <Tag
                              key={idx}
                              color="blue"
                              style={{ cursor: "pointer" }}
                              onClick={() => setSelectedTagFilter(tag)}
                            >
                              #{tag}
                            </Tag>
                          ))}
                        </div>
                      )}

                      {/* Comments Section */}
                      <AnimatePresence>
                        {visibleComments[thread.threadID] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ overflow: "hidden", marginTop: "16px" }}
                          >
                            <Divider style={{ margin: "12px 0" }} />

                            {/* Existing Comments */}
                            {thread.commentsList &&
                              thread.commentsList.length > 0 && (
                                <div style={{ marginBottom: "12px" }}>
                                  {thread.commentsList.map((comment) => (
                                    <div
                                      key={comment.id}
                                      style={{
                                        display: "flex",
                                        gap: "12px",
                                        marginBottom: "16px",
                                        padding: "12px",
                                        backgroundColor: "#fafafa",
                                        borderRadius: "8px",
                                      }}
                                    >
                                      <Avatar src={comment.avatar} size={32} />
                                      <div style={{ flex: 1 }}>
                                        <div>
                                          <Text strong>{comment.author}</Text>
                                          <Text
                                            type="secondary"
                                            style={{
                                              fontSize: "12px",
                                              marginLeft: "8px",
                                            }}
                                          >
                                            {comment.timestamp}
                                          </Text>
                                        </div>
                                        <div style={{ marginTop: "4px" }}>
                                          <Text>{comment.content}</Text>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                            {/* Add Comment Input */}
                            <div style={{ display: "flex", gap: "8px" }}>
                              <Avatar size={32} src={CURRENT_USER_AVATAR} />
                              <Input
                                placeholder="Viết bình luận..."
                                value={commentInputs[thread.threadID] || ""}
                                onChange={(e) =>
                                  setCommentInputs((prev) => ({
                                    ...prev,
                                    [thread.threadID]: e.target.value,
                                  }))
                                }
                                onPressEnter={() =>
                                  handleAddComment(thread.threadID)
                                }
                                suffix={
                                  <SendOutlined
                                    style={{ cursor: "pointer", color: "#1890ff" }}
                                    onClick={() =>
                                      handleAddComment(thread.threadID)
                                    }
                                  />
                                }
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                )}
              />

              {/* Pagination */}
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredThreads.length}
                  onChange={(page, size) => {
                    setCurrentPage(page);
                    if (size) setPageSize(size);
                  }}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} posts`
                  }
                  pageSizeOptions={["5", "10", "20", "50"]}
                />
              </div>
            </>
          )}
        </Card>
      </div>

      {/* ===========================
          RIGHT: Sidebar
          =========================== */}
      <div
        className="sidebar"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* ✅ Search Box - Di chuyển lên đầu */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <Input
              size="large"
              placeholder="Search posts, authors, tags..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
            />
            
            {/* Tag Filter */}
            <Select
              style={{ width: "100%", marginTop: "12px" }}
              value={selectedTagFilter}
              onChange={setSelectedTagFilter}
              placeholder="Filter by tag"
            >
              <Option value="all">📌 All tags</Option>
              {allTags.map((tag) => (
                <Option key={tag} value={tag}>
                  #{tag}
                </Option>
              ))}
            </Select>
          </Card>
        </motion.div>

        <motion.div whileHover={{ translateY: -5 }}>
          <Card title="🔥 Trending Tags">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {allTags.slice(0, 10).map((tag) => {
                const count = threads.filter((t) =>
                  t.tags.includes(tag)
                ).length;
                return (
                  <Tag
                    key={tag}
                    color="blue"
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedTagFilter(tag)}
                  >
                    #{tag} ({count})
                  </Tag>
                );
              })}
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ translateY: -5 }}>
          <Card title="📊 Community Stats">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Text>
                📝 Total Threads: <strong>{threads.length}</strong>
              </Text>
              <Text>
                💬 Total Comments:{" "}
                <strong>
                  {threads.reduce((sum, t) => sum + t.comments, 0)}
                </strong>
              </Text>
              <Text>
                ❤️ Total Likes:{" "}
                <strong>{threads.reduce((sum, t) => sum + t.likes, 0)}</strong>
              </Text>
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ translateY: -5 }}>
          <Card title="📅 Upcoming Events">
            <div>
              <Text strong>JavaScript Study Group</Text>
              <br />
              <Text type="secondary">Tomorrow • 7 PM</Text>
              <br />
              <Button size="small" type="primary" style={{ marginTop: "8px" }}>
                Join
              </Button>
            </div>
            <Divider />
            <div>
              <Text strong>C# Web Dev Workshop</Text>
              <br />
              <Text type="secondary">Saturday • 9 AM</Text>
              <br />
              <Button size="small" type="primary" style={{ marginTop: "8px" }}>
                Join
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ translateY: -5 }}>
          <Card title="🏆 Top Contributors">
            <ul style={{ paddingLeft: "20px" }}>
              <li>Alex Chen (+103)</li>
              <li>Sarah Kim (+92)</li>
              <li>John Doe (+78)</li>
            </ul>
          </Card>
        </motion.div>
      </div>

      {/* ===========================
          Delete Confirmation Modal
          =========================== */}
      <Modal
        title="Confirm Deletion"
        open={deleteModalVisible}
        onOk={() => threadToDelete && handleDelete(threadToDelete)}
        onCancel={() => {
          setDeleteModalVisible(false);
          setThreadToDelete(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this post?</p>
      </Modal>
      {/* ===========================
    Edit Thread Modal
    =========================== */}
<Modal
      open={editModalVisible}
      onCancel={() => setEditModalVisible(false)}
      footer={null}
      width={700}
      destroyOnClose
      closeIcon={<CloseCircleOutlined style={{ fontSize: 20, color: '#8c8c8c' }} />}
      styles={{
        body: { padding: '24px 28px' }
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}
            >
              <EditOutlined style={{ fontSize: 24, color: 'white' }} />
            </div>
            <div>
              <Title level={3} style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
                Edit Your Post
              </Title>
              <Text type="secondary" style={{ fontSize: 14 }}>
                Make your post even better ✨
              </Text>
            </div>
          </div>
        </div>

        <Divider style={{ margin: '0 0 24px 0' }} />

        {/* Title Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 15 }}>
            📝 Title
          </Text>
          <Input
            size="large"
            placeholder="Give your post a catchy title..."
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            maxLength={255}
            showCount
            style={{
              marginBottom: 20,
              borderRadius: 8,
              fontSize: 15
            }}
          />
        </motion.div>

        {/* Content TextArea */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 15 }}>
            ✍️ Content
          </Text>
          <TextArea
            size="large"
            rows={6}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Share your thoughts, ideas, or questions..."
            style={{
              marginBottom: 20,
              borderRadius: 8,
              fontSize: 14,
              lineHeight: 1.6
            }}
          />
        </motion.div>

        {/* Image URL Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 15 }}>
            🖼️ Cover Image (Optional)
          </Text>
          <Input
            size="large"
            placeholder="Paste image URL here..."
            value={editImageUrl}
            onChange={(e) => setEditImageUrl(e.target.value)}
            prefix={<PictureOutlined style={{ color: '#8c8c8c', fontSize: 16 }} />}
            suffix={
              editImageUrl && (
                <CloseCircleOutlined
                  style={{ color: '#ff4d4f', cursor: 'pointer' }}
                  onClick={() => setEditImageUrl('')}
                />
              )
            }
            style={{
              marginBottom: 16,
              borderRadius: 8
            }}
          />

          {/* Live Image Preview */}
          <AnimatePresence>
            {editImageUrl && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{ marginBottom: 20 }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    border: '2px solid #f0f0f0'
                  }}
                >
                  <img
                    src={editImageUrl}
                    alt="Preview"
                    style={{
                      width: '100%',
                      maxHeight: 280,
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      background: 'rgba(0, 0, 0, 0.6)',
                      padding: '4px 8px',
                      borderRadius: 6,
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 500 }}>
                      Preview
                    </Text>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tags Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            background: '#fafafa',
            padding: 16,
            borderRadius: 12,
            marginBottom: 24
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <TagsOutlined style={{ fontSize: 18, color: '#1890ff' }} />
            <Text strong style={{ fontSize: 15 }}>
              Select Tags
            </Text>
            <Tag color="blue" style={{ marginLeft: 'auto' }}>
              {editTags.length} selected
            </Tag>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {availableTags.map((tag) => {
              const isSelected = editTags.includes(tag);
              return (
                <motion.div
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Tag
                    color={isSelected ? 'blue' : 'default'}
                    onClick={() => toggleEditTag(tag)}
                    style={{
                      cursor: 'pointer',
                      padding: '6px 12px',
                      fontSize: 13,
                      borderRadius: 6,
                      border: isSelected ? '2px solid #1890ff' : '2px solid #d9d9d9',
                      fontWeight: isSelected ? 600 : 400,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isSelected && <CheckCircleOutlined style={{ marginRight: 4 }} />}
                    #{tag}
                  </Tag>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Footer Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 16,
            borderTop: '1px solid #f0f0f0'
          }}
        >
          <Text type="secondary" style={{ fontSize: 13 }}>
            💡 Tip: Add relevant tags to reach more people
          </Text>

          <Space size={12}>
            <Button
              size="large"
              onClick={() => setEditModalVisible(false)}
              style={{
                borderRadius: 8,
                fontWeight: 500
              }}
            >
              Cancel
            </Button>

            <Button
              type="primary"
              size="large"
              loading={updating}
              icon={<EditOutlined />}
              onClick={handleUpdate}
              style={{
                borderRadius: 8,
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)'
              }}
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </Button>
          </Space>
        </motion.div>
      </motion.div>
    </Modal>
    </motion.div>
  );
};

export default CommunityPage;