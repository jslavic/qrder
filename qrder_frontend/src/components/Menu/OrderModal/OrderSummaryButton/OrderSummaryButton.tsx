import React from "react";
import { MenuItemType } from "../../Menu";

import { ReactComponent as CartIcon } from "../../../../assets/cart.svg";

import styles from "./OrderSummaryButton.module.css";
import { formatPrice } from "../../../../helpers/general/formatPrice";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

type Props = {
  totalPrice: number;
  orderItems: MenuItemType[];
  className: string;
  onClick: () => void;
};

const OrderSummaryButton = ({
  totalPrice,
  orderItems,
  className,
  onClick,
}: Props) => {
  const { currency } = useSelector((state: RootState) => state.currency);

  return (
    <button className={className} onClick={onClick}>
      <CartIcon className={styles.icon} />
      <span>
        Naruči <strong>{orderItems.length}</strong> za{" "}
        <strong>
          {formatPrice(totalPrice)}
          {currency}
        </strong>
      </span>
    </button>
  );
};

export default OrderSummaryButton;
