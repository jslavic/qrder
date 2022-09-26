import React from "react";
import Button from "../../Common/Buttons/Button/Button";
import { OrderStep } from "../OrderModal/OrderModal";

import { ReactComponent as XSign } from "../../../assets/x.svg";
import { ReactComponent as Checkmark } from "../../../assets/check.svg";

import styles from "./AskTip.module.css";

type Props = {
  setOrderStep: React.Dispatch<React.SetStateAction<OrderStep>>;
  setTip: React.Dispatch<string>;
};

const AskTip = ({ setOrderStep, setTip }: Props) => {
  return (
    <div className={styles.content}>
      <h3 className={styles.title}>Želite li ostaviti napojnicu?</h3>
      <div className={styles.selectionBox}>
        <Button
          onClick={() => setOrderStep("LEAVE_TIP")}
          className={`${styles.btn} ${styles.btn__confirm}`}
        >
          <Checkmark className={styles.icon} /> Ostavi napojnicu
        </Button>
        <Button
          onClick={() => {
            setTip("");
            setOrderStep("CARD_PAYMENT");
          }}
          className={`${styles.btn} ${styles.btn__decline}`}
        >
          <XSign className={styles.icon} /> Ne hvala
        </Button>
      </div>
    </div>
  );
};

export default AskTip;
