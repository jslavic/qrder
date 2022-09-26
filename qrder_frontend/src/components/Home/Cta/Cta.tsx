import React from "react";

import styles from "./Cta.module.css";
import commonStyles from "../Common.module.css";
import generalStyles from "../../../styles/general.module.css";

import AnchorButton from "../../Common/Buttons/AnchorButton/AnchorButton";

type Props = {};

const Cta = (props: Props) => {
  return (
    <section className={commonStyles.section}>
      <div className={styles.cta}>
        <div className={styles.card}>
          <div className={styles.content}>
            <h3 className={styles.title}>
              <span className={generalStyles.highlight}>Registrirajte</span> se
              u par <span className={commonStyles.underline}>jednostavnih</span>{" "}
              koraka
            </h3>
            <p className={styles.desc}>
              Dovedite Qrder u vaš objekt već danas te poboljšajte iskustvo
              vašim kupcima, pretplatu možete otkazati bilo kada. Za dodatne
              informacije nas uvijek možete kontaktirati!{" "}
            </p>
            <div className={styles.buttons}>
              <AnchorButton to={"/partner/register"} isPrimary>
                Postanite partner
              </AnchorButton>
              <AnchorButton to={"/help/contact"}>
                Kontaktirajte nas
              </AnchorButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
