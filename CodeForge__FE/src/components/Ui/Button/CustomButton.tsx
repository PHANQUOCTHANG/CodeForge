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

export const CustomButton: React.FC<CustomButtonProps> = ({
  variant = "primary",
  sizeType = "md",
  fullWidth = false,
  className,
  children,
  ...rest
}) => {
  const classes = classNames(
    "btn",
    `btn--${variant}`,
    `btn--${sizeType}`,
    { "btn--full": fullWidth },
    className
  );

  return (
    <button {...rest} className={classes}>
      {children}
    </button>
  );
};

export default CustomButton;
