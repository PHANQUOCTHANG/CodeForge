import React from "react";
import { AlertCircle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Xóa",
  cancelText = "Hủy",
  isDangerous = true,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <div className="confirm-dialog__header">
          <div className="confirm-dialog__icon">
            <AlertCircle size={24} />
          </div>
          <h2 className="confirm-dialog__title">{title}</h2>
          <button
            className="confirm-dialog__close"
            onClick={onCancel}
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="confirm-dialog__body">
          <p>{message}</p>
        </div>

        <div className="confirm-dialog__footer">
          <button
            className="btn btn--secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className={`btn ${isDangerous ? "btn--danger" : "btn--primary"}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
