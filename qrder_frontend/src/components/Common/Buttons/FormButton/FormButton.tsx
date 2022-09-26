import React from "react";

import styles from "./FormButton.module.css";

type Props = { children?: React.ReactNode };

const FormButton = ({ children }: Props) => {
  return (
    <button type="submit" className={styles.btn}>
      {children}
    </button>
  );
};

export default FormButton;
