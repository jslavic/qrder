import React from "react";
import { ReactComponent as ErrorIcon } from "../../../assets/alert-circle.svg";

import styles from "./ErrorBox.module.css";

type Props = {
  children: React.ReactNode;
};

const ErrorBox = ({ children }: Props) => {
  return (
    <div className={styles.box}>
      <div className={styles.iconBox}>
        <ErrorIcon />
      </div>
      <div className={styles.errorText}>{children}</div>
    </div>
  );
};

export default ErrorBox;
