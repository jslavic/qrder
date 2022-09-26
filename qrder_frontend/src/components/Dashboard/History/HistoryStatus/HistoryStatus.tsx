import React from "react";
import { OrderStatus } from "../../../../constants/enums/orderEnums/orderStatus.enums";
import { OrderType } from "../../../../constants/enums/orderEnums/orderType.enum";

import styles from "./HistoryStatus.module.css";

type Props = {
  status: OrderStatus;
  type: OrderType;
};

const HistoryStatus = ({ status, type }: Props) => {
  if (type === OrderType.PAID) {
    return <div className={`${styles.tag} ${styles.tag__paid}`}>Plaćeno</div>;
  }
  if (type === OrderType.CASH) {
    if (status === OrderStatus.AWAITING_CONFIRMATION) {
      return (
        <div className={`${styles.tag} ${styles.tag__submitted}`}>
          Čeka odobrenje
        </div>
      );
    }
    if (status === OrderStatus.CONFIRMED) {
      return (
        <div className={`${styles.tag} ${styles.tag__accepted}`}>
          Prihvaćeno
        </div>
      );
    }
  }

  return (
    <div className={`${styles.tag} ${styles.tag__submitted}`}>
      Čeka odobrenje
    </div>
  );
};

export default HistoryStatus;
