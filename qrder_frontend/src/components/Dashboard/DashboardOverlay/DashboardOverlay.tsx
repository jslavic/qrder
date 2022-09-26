import React from "react";
import Sidebar from "../../Layouts/Sidebar/Sidebar";

import styles from "./DashboardOverlay.module.css";

type Props = {
  children: React.ReactNode;
};

const DashboardOverlay = ({ children }: Props) => {
  return (
    <div className={styles.box}>
      <Sidebar />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default DashboardOverlay;
