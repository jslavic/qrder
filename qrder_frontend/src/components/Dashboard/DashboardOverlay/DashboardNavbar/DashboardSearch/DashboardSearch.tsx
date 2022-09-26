import React from "react";

import styles from "./DashboardSearch.module.css";

import { ReactComponent as SearchIcon } from "../../../../../assets/search.svg";

type Props = {};

const DashboardSearch = (props: Props) => {
  return (
    <div className={styles.searchDiv}>
      <SearchIcon className={styles.searchIcon} />
      <input
        type="text"
        placeholder="Tražite..."
        className={styles.searchBar}
      />
    </div>
  );
};

export default DashboardSearch;
