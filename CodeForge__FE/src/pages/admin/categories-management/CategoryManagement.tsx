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
        message.success("Category updated successfully");
      } else {
        // Create
        await createMutation.mutateAsync(values as CreateCategoryDto);
        message.success("Category created successfully");
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
      message.success("Category deleted successfully");
    } catch (err) {
      message.error("Failed to delete category");
      console.error(err);
    }
  };

  // 📊 Table columns
  const columns: ColumnsType<CourseCategory> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Description",
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
      title: "Icon",
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
          <Tag>No Icon</Tag>
        ),
    },
    {
      title: "Actions",
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
            Edit
          </Button>
          <Popconfirm
            title="Delete Category"
            description="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record.categoryId)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Delete
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
          <h1 className="category-management__title">Category Management</h1>
          <p className="category-management__subtitle">
            Manage all course categories
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={handleOpenCreate}
          disabled={isLoading}
        >
          Add New Category
        </Button>
      </div>

      {/* Filters */}
      <div className="category-management__filters">
        <Input
          placeholder="Search categories..."
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
          Refresh
        </Button>
      </div>

      {/* Table */}
      <Spin spinning={isLoading || isLoading_mutations}>
        <div className="category-management__table">
          {filteredCategories.length === 0 && !isLoading ? (
            <Empty description="No categories found" />
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
        title={editingCategory ? "Edit Category" : "Add New Category"}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingCategory(null);
        }}
        okText={editingCategory ? "Update" : "Create"}
        confirmLoading={isLoading_mutations}
      >
        <Form form={form} layout="vertical" className="category-form">
          <Form.Item
            label="Category Name *"
            name="name"
            rules={[
              { required: true, message: "Please enter category name" },
              { min: 3, message: "Name must be at least 3 characters" },
              { max: 100, message: "Name must not exceed 100 characters" },
            ]}
          >
            <Input placeholder="e.g., Web Development" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                max: 500,
                message: "Description must not exceed 500 characters",
              },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Optional description for this category"
            />
          </Form.Item>

          <Form.Item
            label="Icon URL"
            name="icon"
            rules={[
              {
                type: "url",
                message: "Please enter a valid URL",
              },
            ]}
          >
            <Input placeholder="e.g., https://example.com/icon.png" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
