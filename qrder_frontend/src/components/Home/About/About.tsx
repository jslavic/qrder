import React from "react";

import styles from "./About.module.css";
import commonStyles from "../Common.module.css";

import { ReactComponent as CheckmarkSvg } from "../../../assets/checkmark.svg";

type Props = {};

const About = (props: Props) => {
  return (
    <section className={commonStyles.section}>
      <div className={styles.about}>
        <h2 className={styles.title}>
          <span className={commonStyles.highlight__dark}>Kako naručiti</span> s{" "}
          <span className={commonStyles.underline}>Qrderom</span>
        </h2>

        <div className={styles.grid}>
          <div className={styles.stepText}>
            <div style={{ marginBottom: "1.2rem" }}>
              <div className={styles.stepNumberBox}>
                <p className={styles.stepNumber}>1</p>
              </div>
            </div>
            <h4 className={styles.stepHeading}>Skenirajte QR kod</h4>
            <ul style={{ listStyle: "none" }}>
              <li className={styles.stepItem}>
                <CheckmarkSvg className={styles.stepIcon} />
                <span>
                  Skenirajte QR kod pomoću vaše kamere na mobilnom uređaju
                </span>
              </li>
              <li className={styles.stepItem}>
                <CheckmarkSvg className={styles.stepIcon} />
                <span>
                  QR kod bi se trebao nalaziti na vidljivom mjestu na svakome
                  stolu
                </span>
              </li>
              <li className={styles.stepItem}>
                <CheckmarkSvg className={styles.stepIcon} />
                <span>
                  Svaki kod je zasebno povezan s točno tim stolom kako bi
                  konobari znali odakle narudžba dolazi
                </span>
              </li>
            </ul>
          </div>
          <div className={styles.stepImgBox}>
            <img
              src="15d4903ffd54f3ad76007ffae8722fc5.png"
              alt="Mobitel"
              className={styles.img}
            />
          </div>

          <div className={styles.stepImgBox}>
            <img
              src="15d4903ffd54f3ad76007ffae8722fc5.png"
              alt="Mobitel"
              className={styles.img}
            />
          </div>
          <div className={styles.stepText}>
            <div style={{ marginBottom: "1.2rem" }}>
              <div className={styles.stepNumberBox}>
                <p className={styles.stepNumber}>2</p>
              </div>
            </div>
            <h4 className={styles.stepHeading}>Ispunite svoju narudžbu</h4>
            <ul style={{ listStyle: "none" }}>
              <li className={styles.stepItem}>
                <CheckmarkSvg className={styles.stepIcon} />
                <span>
                  Nakon što skenirate QR kod, otvorit će se <i>eMeni</i> putem
                  vašeg internet preglednika
                </span>
              </li>
              <li className={styles.stepItem}>
                <CheckmarkSvg className={styles.stepIcon} />
                <span>Od tamo možete ispuniti svoju narudžbu</span>
              </li>
              <li className={styles.stepItem}>
                <CheckmarkSvg className={styles.stepIcon} />
                <span>
                  Nakon što ste zadovoljni sa svojom narudžbom, potvrdite ju za
                  pripremanje
                </span>
              </li>
            </ul>
          </div>

          <div className={styles.stepText}>
            <div style={{ marginBottom: "1.2rem" }}>
              <div className={styles.stepNumberBox}>
                <p className={styles.stepNumber}>3</p>
              </div>
            </div>
            <h4 className={styles.stepHeading}>Čekajte svoju nadrudžbu</h4>
            <ul style={{ listStyle: "none" }}>
              <li className={styles.stepItem}>
                <CheckmarkSvg className={styles.stepIcon} />
                <span>
                  Osoblje može se ulogirati u našu upravljačku ploču putem Qrder
                  stranice gdje imaju uvid u sve narudžbe koje se moraju
                  izvršiti
                </span>
              </li>
              <li className={styles.stepItem}>
                <CheckmarkSvg className={styles.stepIcon} />
                <span>
                  U slučaju pogreške pri naručivanju moguće je otkazati narudžbu
                  sve dok nije označena kao primljena od strane osoblja
                </span>
              </li>
            </ul>
          </div>
          <div className={styles.stepImgBox}>
            <img
              src="15d4903ffd54f3ad76007ffae8722fc5.png"
              alt="Mobitel"
              className={styles.img}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
