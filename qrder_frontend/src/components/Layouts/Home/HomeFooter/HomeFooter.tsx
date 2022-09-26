import React from "react";
import { Link } from "react-router-dom";

import styles from "./HomeFooter.module.css";

type Props = {};

const HomeFooter = (props: Props) => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.logoBox}>
        <div className={styles.logo}>Qrder</div>
        <p className={styles.copyright}>
          Copyright © {year} Qrder. Sva prava pridržana
        </p>
      </div>
      <div className={styles.extraBox}>
        <p className={styles.title}>DODATNO</p>
        <ul className={styles.extras}>
          <li>
            <Link to={"help/about"}>O nama</Link>
          </li>
          <li>
            <Link to={"/help/tutorial"}>Naučite koristiti Qrder</Link>
          </li>
          <li>
            <Link to={"/help/payments"}>Plaćanje</Link>
          </li>
          <li>
            <Link to={"/help/terms"}>Uvjeti korištenja</Link>
          </li>
          <li>
            <Link to={"/help/contact"}>Kontaktirajte nas</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default HomeFooter;
