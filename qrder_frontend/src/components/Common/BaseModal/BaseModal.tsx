import React, { CSSProperties } from "react";

import { ReactComponent as CloseIcon } from "../../../assets/x.svg";

import styles from "./BaseModal.module.css";

type Props = {
  small?: true;
  className?: string;
  style?: CSSProperties;
  closeModal: () => void;
  children: React.ReactNode;
};

const BaseModal = ({
  children,
  closeModal,
  className,
  style,
  small,
}: Props) => {
  return (
    <div className={styles.modal} onClick={closeModal}>
      <div
        style={style}
        className={`${styles.modalContent} ${
          small ? styles.modalContent_small : styles.modalContent__large
        } ${className ? className : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseIcon className={styles.close} onClick={closeModal} />
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
