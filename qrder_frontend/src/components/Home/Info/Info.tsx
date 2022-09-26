import React from "react";

import styles from "./Info.module.css";
import commonStyles from "../Common.module.css";

import { ReactComponent as UserSvg } from "../../../assets/users.svg";
import { ReactComponent as DollarSignSvg } from "../../../assets/dollar-sign.svg";
import { ReactComponent as BarChartSvg } from "../../../assets/bar-chart.svg";

type Props = {};

const Info = (props: Props) => {
  return (
    <section className={commonStyles.section}>
      <div className={styles.info}>
        <div className={styles.heading}>
          <div style={{ position: "sticky", top: "15%" }}>
            <h2 className={styles.headingTitle}>
              <span className={commonStyles.highlight__light}>Moderni</span>{" "}
              načini naručivanja
            </h2>
            <p className={styles.headingContent}>
              Budućnost je sada, a s njome dolaze i moderna rješenja
              tradicionalnim i zastarjelim pristupima određenim problemima.
              Budite među prvima koji u svoje objekte unosite ovu jedinstvenu
              tehnologiju kojom ćete olakšati proces naručivanja vašim kupcima
              te dobiti informacije o vašim prodajama i zaradama kako biste
              napravili bolje poslovne odluke
            </p>
          </div>
        </div>
        <div className={styles.features}>
          <div className={styles.featureBox}>
            <div className={styles.featureIconBox}>
              <UserSvg className={styles.featureIcon} />
            </div>
            <h3 className={styles.featureTitle}>Poboljšano iskustvo kupcima</h3>
            <p className={styles.featureParahraph}>
              Vaši kupci dobivaju uvid na vašu ponudu putem našeg <i>eMenija</i>{" "}
              te mogu naručiti kada su spremni bez čekanja konobara da primi
              njihovu narudžbu što tijekom velike gužve može biti frustrirajuće
              iskustvo te dovodi do nezadovoljnih kupaca
            </p>
          </div>
          <div className={styles.featureBox}>
            <div className={styles.featureIconBox}>
              <BarChartSvg className={styles.featureIcon} />
            </div>
            <h3 className={styles.featureTitle}>Analiza proizvoda</h3>
            <p className={styles.featureParahraph}>
              Analizirajte prodaje vaših proizdvoda kako biste stekli uvid u
              popularnost pojedinih proizvoda. Qrder vam također nudi brze
              automatizirane opcije kako biste dodali popuste tijekom sati s
              najmanje prometa kako biste privukli nove kupce
            </p>
          </div>
          <div className={styles.featureBox}>
            <div className={styles.featureIconBox}>
              <DollarSignSvg className={styles.featureIcon} />
            </div>
            <h3 className={styles.featureTitle}>Izvješće o prihodima</h3>
            <p className={styles.featureParahraph}>
              Pratite svoje mjesečne prihode kako biste adekvatno prilagodili
              svoj poslovni model. Usporedite svoje prihode s prijašnjim
              mjesecima kako biste dobili relativan uvid o vašim prihodima u
              odnosu na prije
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Info;
