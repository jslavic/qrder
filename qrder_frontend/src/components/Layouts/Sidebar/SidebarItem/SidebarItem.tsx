import React from "react";
import { Link } from "react-router-dom";

import styles from "./SidebarItem.module.css";

type Props = {
  text: string;
  path: string;
  isActive: boolean;
  SidebarIcon: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
};

const SidebarItem = ({ text, path, isActive, SidebarIcon }: Props) => {
  return (
    <Link to={`/dashboard/${path}`} style={{ textDecoration: "none" }}>
      <li className={`${styles.contentItem} ${isActive ? styles.active : ""}`}>
        <div className={styles.contentItemIconBox}>
          <SidebarIcon className={styles.contentItemIcon} />
        </div>
        <span className={styles.contentItemText}>{text}</span>
      </li>
    </Link>
  );
};

export default SidebarItem;
