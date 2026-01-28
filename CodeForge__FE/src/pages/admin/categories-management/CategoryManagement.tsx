import React, { useState } from "react";
import {
  Button,
  Input,
  Popconfirm,
  message,
  Table,
  Modal,
  Form,
  Space,
  Tag,
  Empty,
  Spin,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  useCourseCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/features/course-category/hooks/useCoursesCategory";
import type {
  CourseCategory,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/features/course-category/types";
import "./CategoryManagement.scss";

interface CategoryFormData {
  name: string;
  description?: string;
  icon?: string;
}

const CategoryManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CourseCategory | null>(
    null
  );
  const [form] = Form.useForm<CategoryFormData>();

  // 🔄 Hooks
  const { data: categories, isLoading, refetch } = useCourseCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  // 🔍 Filter categories
  const filteredCategories = (categories || []).filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ➕ Handle create new
  const handleOpenCreate = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // ✏️ Handle edit
  const handleEdit = (category: CourseCategory) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "",
    });
    setIsModalVisible(true);
  };

  // 💾 Handle save
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editingCategory) {
        // Update
        await updateMutation.mutateAsync({
          id: editingCategory.categoryId,
          dto: {
            categoryId: editingCategory.categoryId,
            ...values,
          } as UpdateCategoryDto,
        });
        message.success("Cập nhật danh mục thành công");
      } else {
        // Create
        await createMutation.mutateAsync(values as CreateCategoryDto);
        message.success("Tạo danh mục thành công");
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingCategory(null);
    } catch (err) {
      console.error(err);
    }
  };

  // 🗑️ Handle delete
  const handleDelete = async (categoryId: string) => {
    try {
      await deleteMutation.mutateAsync(categoryId);
      message.success("Xóa danh mục thành công");
    } catch (err) {
      message.error("Xóa danh mục thất bại");
      console.error(err);
    }
  };

  // 📊 Table columns
  const columns: ColumnsType<CourseCategory> = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      width: "30%",
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "40%",
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="text-gray-600">{text || "-"}</span>
        </Tooltip>
      ),
    },
    {
      title: "Biểu tượng",
      dataIndex: "icon",
      key: "icon",
      width: "10%",
      render: (icon: string) =>
        icon ? (
          <img
            src={icon}
            alt="icon"
            style={{ width: "24px", height: "24px" }}
          />
        ) : (
          <Tag>Không có icon</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: "20%",
      align: "center" as const,
      render: (_, record: CourseCategory) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn có chắc chắn muốn xóa danh mục này không?"
            onConfirm={() => handleDelete(record.categoryId)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const isLoading_mutations =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="category-management">
      {/* Header */}
      <div className="category-management__header">
        <div>
          <h1 className="category-management__title">Quản Lý Danh Mục</h1>
          <p className="category-management__subtitle">
            Quản lý tất cả danh mục khóa học
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={handleOpenCreate}
          disabled={isLoading}
        >
          Thêm Danh Mục Mới
        </Button>
      </div>

      {/* Filters */}
      <div className="category-management__filters">
        <Input
          placeholder="Tìm kiếm danh mục..."
          prefix="🔍"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: "300px" }}
          allowClear
        />
        <Button
          icon={<ReloadOutlined />}
          onClick={() => refetch()}
          loading={isLoading}
        >
          Làm mới
        </Button>
      </div>

      {/* Table */}
      <Spin spinning={isLoading || isLoading_mutations}>
        <div className="category-management__table">
          {filteredCategories.length === 0 && !isLoading ? (
            <Empty description="Không tìm thấy danh mục nào" />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredCategories}
              rowKey="categoryId"
              pagination={{
                pageSize: 10,
                total: filteredCategories.length,
              }}
              bordered
            />
          )}
        </div>
      </Spin>

      {/* Modal */}
      <Modal
        title={editingCategory ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục Mới"}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingCategory(null);
        }}
        okText={editingCategory ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
        confirmLoading={isLoading_mutations}
      >
        <Form form={form} layout="vertical" className="category-form">
          <Form.Item
            label="Tên Danh Mục *"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên danh mục" },
              { min: 3, message: "Tên phải có ít nhất 3 ký tự" },
              { max: 100, message: "Tên không được vượt quá 100 ký tự" },
            ]}
          >
            <Input placeholder="Ví dụ: Lập trình Web" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              {
                max: 500,
                message: "Mô tả không được vượt quá 500 ký tự",
              },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Mô tả tùy chọn cho danh mục này"
            />
          </Form.Item>

          <Form.Item
            label="URL Biểu tượng (Icon)"
            name="icon"
            rules={[
              {
                type: "url",
                message: "Vui lòng nhập một URL hợp lệ",
              },
            ]}
          >
            <Input placeholder="Ví dụ: https://example.com/icon.png" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
