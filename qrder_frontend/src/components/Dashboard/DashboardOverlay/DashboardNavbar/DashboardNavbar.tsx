import React from "react";

import styles from "./DashboardNavbar.module.css";
import DashboardSearch from "./DashboardSearch/DashboardSearch";

type Props = {};

const DashboardNavbar = (props: Props) => {
  return (
    <header className={styles.navbar}>
      <DashboardSearch />
      <p className={styles.companyName}>Qrder Company Inc.</p>
    </header>
  );
};

export default DashboardNavbar;
