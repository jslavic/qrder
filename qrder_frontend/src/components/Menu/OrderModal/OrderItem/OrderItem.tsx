import React from "react";
import { MenuItemType } from "../../Menu";

import { ReactComponent as EditIcon } from "../../../../assets/edit.svg";
import { ReactComponent as AddIcon } from "../../../../assets/plus.svg";
import { ReactComponent as RemoveIcon } from "../../../../assets/minus.svg";

import styles from "./OrderItem.module.css";
import { formatPrice } from "../../../../helpers/general/formatPrice";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

type Props = {
  item: MenuItemType;
  onAddItem: (item: MenuItemType) => void;
  setModalItem: (id: number) => void;
  setModalShowing: React.Dispatch<React.SetStateAction<boolean>>;
};

const OrderItem = ({
  item,
  onAddItem,
  setModalItem,
  setModalShowing,
}: Props) => {
  const { currency } = useSelector((state: RootState) => state.currency);

  return (
    <div className={styles.item}>
      <div className={styles.amountInfo}>
        <p className={styles.amount}>{item.quantity}x</p>
        <button
          className={`${styles.btn} ${styles.btn__edit}`}
          onClick={() => {
            setModalShowing(false);
            setModalItem(item.id);
          }}
        >
          <EditIcon className={styles.icon__edit} />
        </button>
      </div>
      <div>
        <p className={styles.name}>{item.name}</p>
        <p className={styles.desc}>{item.description}</p>
      </div>
      <div className={styles.actions}>
        <p className={styles.price}>
          {formatPrice(item.fullPrice)}
          {currency}
        </p>
        <div className={styles.btnBox}>
          <button
            className={styles.btn}
            onClick={(e) => {
              e.stopPropagation();
              const itemPrice = item.discount
                ? item.discount.discountPrice
                : item.price;
              onAddItem({
                ...item,
                quantity: item.quantity - 1,
                fullPrice: item.fullPrice - itemPrice,
              });
            }}
          >
            <RemoveIcon className={styles.icon} />
          </button>
          <button
            className={styles.btn}
            onClick={(e) => {
              e.stopPropagation();
              const itemPrice = item.discount
                ? item.discount.discountPrice
                : item.price;
              onAddItem({
                ...item,
                quantity: item.quantity + 1,
                fullPrice: item.fullPrice + itemPrice,
              });
            }}
          >
            <AddIcon className={styles.icon} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
