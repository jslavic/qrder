import React from "react";
import { Link } from "react-router-dom";
import AnchorButton from "../../../Common/Buttons/AnchorButton/AnchorButton";

import styles from "./HomeNavbar.module.css";

type Props = {};

function HomeNavbar(props: Props) {
  return (
    <header className={styles.header}>
      <Link to={"/"} style={{ textDecoration: "none" }}>
        <div className={styles.header__logoBox}>Qrder</div>
      </Link>
      <nav>
        <ul className={styles.header__navList}>
          <li className={styles.header__navListItem}>
            <Link to={"user/register"} className={styles.header__navListLink}>
              Registracija kupca
            </Link>
          </li>
          <li className={styles.header__navListItem}>
            <Link
              to={"/partner/register"}
              className={styles.header__navListLink}
            >
              Postanite partner
            </Link>
          </li>
          <li className={styles.header__navListItem}>
            <AnchorButton to={"/partner/login"} isPrimary>
              Prijavite se kao partner
            </AnchorButton>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default HomeNavbar;
