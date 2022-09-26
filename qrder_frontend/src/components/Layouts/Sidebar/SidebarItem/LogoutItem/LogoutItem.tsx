import React from "react";

import { ReactComponent as LogoutIcon } from "../../../../../assets/logout.svg";

import styles from "./LogoutItem.module.css";
import itemStyles from "../SidebarItem.module.css";
import { URL } from "../../../../../constants/config/url";
import { useDispatch } from "react-redux";
import { authActions } from "../../../../../store/slices/auth.slice";
import Cookies from "js-cookie";

const logoutUrl = `${URL}/company-authentication/logout`;

const LogoutItem = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const paymentResponse = await fetch(logoutUrl, {
      method: "POST",
      credentials: "include",
    });
    if (!paymentResponse.ok) return;
    Cookies.remove("AuthType");
    dispatch(authActions.logout());
  };

  return (
    <button className={styles.btn} onClick={handleLogout}>
      <li className={itemStyles.contentItem}>
        <div className={itemStyles.contentItemIconBox}>
          <LogoutIcon className={itemStyles.contentItemIcon} />
        </div>
        <span className={itemStyles.contentItemText}>Odjava</span>
      </li>
    </button>
  );
};

export default LogoutItem;
