import React from "react";

import styles from "./LoadingSpinner.module.css";

type Props = {
  className?: string;
  size?: number;
};

const LoadingSpinner = ({ size = 100, className }: Props) => {
  return (
    <div className={`${styles.spinnerBox} ${className ?? ""}`}>
      <div className={styles.spinner} style={{ width: size, height: size }}>
        <div className={styles.bar1}></div>
        <div className={styles.bar2}></div>
        <div className={styles.bar3}></div>
        <div className={styles.bar4}></div>
        <div className={styles.bar5}></div>
        <div className={styles.bar6}></div>
        <div className={styles.bar7}></div>
        <div className={styles.bar8}></div>
        <div className={styles.bar9}></div>
        <div className={styles.bar10}></div>
        <div className={styles.bar11}></div>
        <div className={styles.bar12}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
