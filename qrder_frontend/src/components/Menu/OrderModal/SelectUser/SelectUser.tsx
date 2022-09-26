import React from "react";
import Button from "../../../Common/Buttons/Button/Button";
import { OrderStep } from "../OrderModal";

import { ReactComponent as ArrowRight } from "../../../../assets/arrow-circle-right.svg";
import { ReactComponent as UserCircle } from "../../../../assets/user-circle-thin.svg";

import styles from "./SelectUser.module.css";

type Props = {
  setOrderStep: React.Dispatch<React.SetStateAction<OrderStep>>;
};

const SelectUser = ({ setOrderStep }: Props) => {
  return (
    <div className={styles.content}>
      <h3 className={styles.title}>Odaberite korisnika</h3>
      <div className={styles.selectionBox}>
        <Button className={`${styles.btn} ${styles.btn__primary}`}>
          <UserCircle className={styles.icon} /> Prijavite se
        </Button>
        <Button
          onClick={() => setOrderStep("SELECT_PAYMENT_TYPE")}
          className={`${styles.btn} ${styles.btn__secondary}`}
        >
          <ArrowRight className={styles.icon} /> Nastavite kao gost
        </Button>
      </div>
    </div>
  );
};

export default SelectUser;
