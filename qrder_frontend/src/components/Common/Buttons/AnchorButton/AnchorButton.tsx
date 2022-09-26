import React from "react";
import { Link } from "react-router-dom";
import styles from "./AnchorButton.module.css";

type Props = { to: string; isPrimary?: boolean; children?: React.ReactNode };

const AnchorButton = ({ to, isPrimary, children }: Props) => {
  return (
    <Link
      to={to}
      className={`${styles.btn} ${
        isPrimary ? styles.btnPrimary : styles.btnSecondary
      }`}
    >
      {children}
    </Link>
  );
};

export default AnchorButton;
