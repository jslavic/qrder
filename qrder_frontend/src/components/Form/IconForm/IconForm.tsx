import React from "react";
import FormBox from "../FormBox/FormBox";

import styles from "./IconForm.module.css";

type Props = {
  title: React.ReactNode;
  desc: React.ReactNode;
  icon: React.ReactNode;
};

const IconForm = ({ title, desc, icon }: Props) => {
  return (
    <FormBox title={title}>
      <div className={styles.content}>
        <div className={styles.icon}>{icon}</div>
        <div className={styles.desc}>{desc}</div>
      </div>
    </FormBox>
  );
};

export default IconForm;
