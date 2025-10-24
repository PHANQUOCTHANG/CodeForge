import React from "react";
import { ButtonProps } from "antd";
import classNames from "classnames";
import "./CustomButton.scss";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "ghost"
  | "login"
  | "register"
  | "menu";
type Size = "sm" | "md" | "lg";

interface CustomButtonProps extends ButtonProps {
  variant?: Variant;
  sizeType?: Size;
  fullWidth?: boolean;
  className?: string;
}

/**
 * ✅ CustomButton có hỗ trợ ref để tránh warning findDOMNode
 * ✅ Tương thích tốt với Ant Design Dropdown / Tooltip / Modal
 */
const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      variant = "primary",
      sizeType = "md",
      fullWidth = false,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const classes = classNames(
      "btn",
      `btn--${variant}`,
      `btn--${sizeType}`,
      { "btn--full": fullWidth },
      className
    );

    return (
      <button ref={ref} {...rest} className={classes}>
        {children}
      </button>
    );
  }
);

// ⚠️ Tên hiển thị phục vụ debug React DevTools
CustomButton.displayName = "CustomButton";

export default CustomButton;
