import React from "react";
import { OrderStatus } from "../../../../constants/enums/orderEnums/orderStatus.enums";
import { OrderType } from "../../../../constants/enums/orderEnums/orderType.enum";

import styles from "./OrderStatusTag.module.css";

type Props = {
  status: OrderStatus;
  type: OrderType;
};

const tagProperties = {
  className: `${styles.tag}`,
  text: "",
};

const OrderStatusTag = ({ status, type }: Props) => {
  if (type === OrderType.PAID) {
    tagProperties.className = `${styles.tag} ${styles.tag__paid}`;
    tagProperties.text = "Plaćeno";
  }
  if (type === OrderType.CASH) {
    if (status === OrderStatus.AWAITING_CONFIRMATION) {
      tagProperties.className = `${styles.tag} ${styles.tag__pending}`;
      tagProperties.text = "Čeka odobrenje";
    }
    if (status === OrderStatus.CONFIRMED) {
      tagProperties.className = `${styles.tag} ${styles.tag__accepted}`;
      tagProperties.text = "Prihvaćeno";
    }
  }

  return <div className={tagProperties.className}>{tagProperties.text}</div>;
};

export default OrderStatusTag;
