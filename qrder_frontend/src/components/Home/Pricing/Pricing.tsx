import React from "react";

import styles from "./Pricing.module.css";
import commonStyles from "../Common.module.css";
import generalStyles from "../../../styles/general.module.css";

import { PreselectedPlans } from "../../../constants/enums/auth.enums";

import { ReactComponent as CheckmarkSvg } from "../../../assets/checkmark.svg";
import { ReactComponent as WhiteCheckmarkSvg } from "../../../assets/checkmark-white.svg";

import { Link } from "react-router-dom";

type Props = {};

const Pricing = (props: Props) => {
  return (
    <section className={commonStyles.section}>
      <div className={styles.pricing}>
        <h2 className={styles.heading}>
          <span className={generalStyles.highlight}>Odaberite plan</span> koji{" "}
          <span className={commonStyles.underline}>vama</span> odgovara
        </h2>
        <p className={styles.warranty}>
          Ukoliko niste zadovoljni s našom uslugom, možete otkazati svoju
          pretplatu bilo kada
          <br /> uz <strong>100%</strong> povrata vašeg novca
        </p>
        <div className={styles.cards}>
          <div className={`${styles.card} ${styles.card__highlight}`}>
            <h4 className={styles.title}>Standard</h4>
            <p className={styles.desc}>Prilagođen za većinu objekata</p>
            <p className={styles.price}>110€</p>
            <p className={styles.rate}>po objektu/mjesečno</p>
            <div className={styles.divider} />
            <ul className={styles.features}>
              <li>
                <WhiteCheckmarkSvg className={styles.icon} />
                <span>Do 30 jedinstvenih identifikacijskih QR kodova</span>
              </li>
              <li>
                <WhiteCheckmarkSvg className={styles.icon} />
                <span>Pretplata na mjesečnoj bazi</span>
              </li>
              <li>
                <WhiteCheckmarkSvg className={styles.icon} />
                <span>Neograničen broj proizvoda</span>
              </li>
              <li>
                <WhiteCheckmarkSvg className={styles.icon} />
                <span>Administrativna ploča za analizu prodaja</span>
              </li>
              <li>
                <WhiteCheckmarkSvg className={styles.icon} />
                <span>Dostupna služba za korisnike</span>
              </li>
            </ul>
            <Link
              to={"/partner/register"}
              state={{
                selectedPlan: PreselectedPlans.STANDARD,
                isFirstReload: true,
              }}
              className={styles.btn}
            >
              Izaberite plan
            </Link>
          </div>

          <div className={styles.card}>
            <h4 className={styles.title}>Premium</h4>
            <p className={styles.desc}>Za objekte s visokim kapacitetom</p>
            <p className={styles.price}>310€</p>
            <p className={styles.rate}>po objektu/mjesečno</p>
            <div className={styles.divider} />
            <ul className={styles.features}>
              <li>
                <CheckmarkSvg className={styles.icon} />
                <span>Do 100 jedinstvenih identifikacijskih QR kodova</span>
              </li>
              <li>
                <CheckmarkSvg className={styles.icon} />
                <span>Pretplata na mjesečnoj bazi</span>
              </li>
              <li>
                <CheckmarkSvg className={styles.icon} />
                <span>Neograničen broj proizvoda</span>
              </li>
              <li>
                <CheckmarkSvg className={styles.icon} />
                <span>Administrativna ploča za analizu prodaja</span>
              </li>
              <li>
                <CheckmarkSvg className={styles.icon} />
                <span>Dostupna služba za korisnike</span>
              </li>
            </ul>
            <Link
              to={"/partner/register"}
              state={{
                selectedPlan: PreselectedPlans.PREMIUM,
                isFirstReload: true,
              }}
              className={styles.btn}
            >
              Izaberite plan
            </Link>
          </div>

          <div className={styles.card}>
            <h4 className={styles.title}>Prilagođen</h4>
            <p className={styles.desc}>Za evente ili posebne objekte</p>
            <p className={styles.price}>???€</p>
            <p className={styles.rate}>prema dogovoru</p>
            <div className={styles.divider} />
            <ul className={styles.features}>
              <li>
                <CheckmarkSvg className={styles.icon} />
                <span>Broj QR kodova prema potrebi</span>
              </li>
              <li>
                <CheckmarkSvg className={styles.icon} />
                <span>Plaćanje po dogovoru</span>
              </li>
              <li>
                <CheckmarkSvg className={styles.icon} />
                <span>Neograničen broj proizvoda</span>
              </li>
              <li>
                <CheckmarkSvg className={styles.icon} />
                <span>Administrativna ploča za analizu prodaja</span>
              </li>
              <li>
                <CheckmarkSvg className={styles.icon} />
                <span>Dostupna služba za korisnike</span>
              </li>
            </ul>
            <Link
              to={"/help/contact"}
              className={`${styles.btn} ${styles.btn__black}`}
            >
              Kontaktirajte nas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
