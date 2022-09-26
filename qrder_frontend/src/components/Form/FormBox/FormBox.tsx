import React from "react";

import styles from "./FormBox.module.css";

type Props = {
  title: React.ReactNode; // Title is react node because it should have highlighted text
  desc?: React.ReactNode;
  children?: React.ReactNode;
};

const FormBox = ({ title, desc, children }: Props) => {
  return (
    <div className={styles.formBox}>
      <div className={styles.titleBox}>
        <h5 className={styles.title}>{title}</h5>
        {desc && <p className={styles.desc}>{desc}</p>}
      </div>
      {children}
    </div>
  );
};

export default FormBox;
