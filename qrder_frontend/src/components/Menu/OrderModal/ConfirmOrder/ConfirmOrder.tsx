import React from "react";
import { MenuItemType } from "../../Menu";
import OrderItem from "../OrderItem/OrderItem";
import Button from "../../../Common/Buttons/Button/Button";
import { formatPrice } from "../../../../helpers/general/formatPrice";
import { OrderStep } from "../OrderModal";

import { ReactComponent as CartIcon } from "../../../../assets/cart.svg";

import styles from "./ConfirmOrder.module.css";
import genericStyles from "../../MenuModal.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

type Props = {
  totalPrice: number;
  orderItems: MenuItemType[];
  onAddItem: (item: MenuItemType) => void;
  setModalItem: (id: number) => void;
  setOrderStep: React.Dispatch<React.SetStateAction<OrderStep>>;
};

const ConfirmOrder = ({
  totalPrice,
  orderItems,
  onAddItem,
  setModalItem,
  setOrderStep,
}: Props) => {
  const { currency } = useSelector((state: RootState) => state.currency);

  return (
    <div className={genericStyles.content}>
      <div className={genericStyles.headingBox}>
        <h3 className={styles.title}>Vaša narudžba</h3>
        <p className={styles.itemNumber}>
          {orderItems.length}{" "}
          {orderItems.length === 1 ? "proizvod" : "proizvoda"}
        </p>
      </div>
      <div className={`${genericStyles.scrollableContent} ${styles.items}`}>
        {orderItems.map((item) => (
          <OrderItem
            item={item}
            onAddItem={onAddItem}
            setModalItem={setModalItem}
            setModalShowing={() => setOrderStep("SHOWING_BUTTON")}
          />
        ))}
      </div>
      <Button
        className={styles.submitBtn}
        onClick={() => setOrderStep("SELECT_USER")}
      >
        <CartIcon className={styles.icon} />
        <span>
          Naruči za{" "}
          <strong>
            {formatPrice(totalPrice)} {currency}
          </strong>
        </span>
      </Button>
    </div>
  );
};

export default ConfirmOrder;
