import React from "react";
import Button from "../../../Common/Buttons/Button/Button";
import { OrderStep } from "../OrderModal";

import { ReactComponent as Cash } from "../../../../assets/coin-cash.svg";
import { ReactComponent as CreditCard } from "../../../../assets/credit-card-fill.svg";
import { ReactComponent as UserGroup } from "../../../../assets/user-friends.svg";

import styles from "./PaymentType.module.css";

type Props = {
  setOrderStep: React.Dispatch<React.SetStateAction<OrderStep>>;
};

const PaymentType = ({ setOrderStep }: Props) => {
  return (
    <div className={styles.content}>
      <h3 className={styles.title}>Odaberite način plaćanja</h3>
      <div className={styles.selectionBox}>
        <Button
          onClick={() => setOrderStep("ORDER_STATUS")}
          className={`${styles.btn} ${styles.btn__primary}`}
        >
          <Cash className={styles.icon} /> Plaćanje gotovinom
        </Button>
        <Button
          onClick={() => setOrderStep("ASK_TIP")}
          className={`${styles.btn} ${styles.btn__secondary}`}
        >
          <CreditCard className={styles.icon} /> Plaćanje karticom
        </Button>
        <Button
          onClick={() => setOrderStep("SELECT_PAYMENT_TYPE")}
          className={`${styles.btn} ${styles.btn__tertiary}`}
        >
          <UserGroup className={styles.icon} /> Grupno plaćanje karticom
        </Button>
      </div>
    </div>
  );
};

export default PaymentType;
