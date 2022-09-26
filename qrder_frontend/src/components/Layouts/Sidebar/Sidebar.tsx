import React from "react";
import SidebarItem from "./SidebarItem/SidebarItem";
import { useLocation } from "react-router-dom";
import LogoutItem from "./SidebarItem/LogoutItem/LogoutItem";

import { ReactComponent as EditIcon } from "../../../assets/edit.svg";
import { ReactComponent as LiveIcon } from "../../../assets/live.svg";
import { ReactComponent as GraphIcon } from "../../../assets/graph.svg";
import { ReactComponent as HistoryIcon } from "../../../assets/history.svg";
import { ReactComponent as QrIcon } from "../../../assets/qrcode.svg";
import { ReactComponent as SettingsIcon } from "../../../assets/settings.svg";
import { ReactComponent as WithdrawIcon } from "../../../assets/bank-plus.svg";

import styles from "./Sidebar.module.css";

type Props = {};

const Sidebar = (props: Props) => {
  const { pathname } = useLocation();

  return (
    <nav className={styles.sidebar}>
      <div className={styles.logoBox}>
        <p className={styles.logo}>Qrder</p>
      </div>
      <ul className={styles.content}>
        <SidebarItem
          text="Narudžbe uživo"
          path="orders"
          isActive={pathname.endsWith("/orders")}
          SidebarIcon={LiveIcon}
        />
        <SidebarItem
          text="Povijest nardužbi"
          path="history"
          isActive={pathname.endsWith("/history")}
          SidebarIcon={HistoryIcon}
        />
        <SidebarItem
          text="Analiza prodaja"
          path="analytics"
          isActive={pathname.split("/").includes("analytics")}
          SidebarIcon={GraphIcon}
        />
        <SidebarItem
          text="Uredite ponudu"
          path="products"
          isActive={pathname.split("/").includes("products")}
          SidebarIcon={EditIcon}
        />
        <SidebarItem
          text="QR kodovi"
          path="qr-codes"
          isActive={pathname.endsWith("/qr-codes")}
          SidebarIcon={QrIcon}
        />
        <SidebarItem
          text="Postavke"
          path="settings"
          isActive={pathname.endsWith("/settings")}
          SidebarIcon={SettingsIcon}
        />
        <SidebarItem
          text="Podizanje novca"
          path="withdraw"
          isActive={pathname.endsWith("/withdraw")}
          SidebarIcon={WithdrawIcon}
        />
      </ul>
      <div className={styles.bottomSection}>
        <LogoutItem />
      </div>
    </nav>
  );
};

export default Sidebar;
