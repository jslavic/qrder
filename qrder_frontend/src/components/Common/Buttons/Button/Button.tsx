import React from "react";

import styles from "./Button.module.css";

type Props = {
  buttonType?: true;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  form?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

const Button = ({
  buttonType,
  className,
  disabled,
  style,
  form,
  onClick,
  children,
}: Props) => {
  return (
    <button
      className={`${styles.btn} ${className || ""}`}
      style={style}
      onClick={onClick}
      type={buttonType ? "button" : "submit"}
      form={form}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
