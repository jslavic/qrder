import React, { useEffect, useRef } from "react";

import { gsap } from "gsap";
import { TextPlugin } from "gsap/all";

import styles from "./Header.module.css";
import generalStyles from "../../../styles/general.module.css";

import AnchorButton from "../../Common/Buttons/AnchorButton/AnchorButton";

type Props = {};

const words = ["u kafiću", "u restoranu", "u klubu", "na eventu"];

const Header = (props: Props) => {
  const cursorRef = useRef<HTMLSpanElement>(null);
  const wordsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(TextPlugin);

    gsap.to(cursorRef.current, {
      opacity: 0,
      ease: "power2.inOut",
      duration: 0.7,
      repeat: -1,
    });

    const masterTl = gsap.timeline({ repeat: -1 });

    words.forEach((word) => {
      const tl = gsap.timeline({ repeat: 1, yoyo: true });
      tl.to(wordsRef.current, { duration: 1, text: word });
      masterTl.add(tl);
    });
  }, []);

  return (
    <section style={{ paddingTop: "1.8rem" }}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Omogućite{" "}
          <span className={generalStyles.highlight}>
            digitalno
            <br /> naručivanje
          </span>{" "}
          QR kodom
          <br />
          <span
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            <span ref={wordsRef} className={styles.typewriter}></span>
            <span ref={cursorRef} className={styles.cursor}>
              _
            </span>
          </span>
        </h1>
        <p className={styles.subheading}>
          Nudimo jednostavno naručivanje mobitelom skeniranjem qr koda uz
          istodobnu analizu vaših prodaja kako biste poboljšali svoje usluge
        </p>
        <div className={styles.buttons}>
          <AnchorButton to="/partner/register" isPrimary>
            Postanite partner
          </AnchorButton>
          <AnchorButton to="/help/contact">Kontaktirajte as</AnchorButton>
        </div>
      </div>
    </section>
  );
};

export default Header;
