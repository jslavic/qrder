import React, { useState } from "react";
import { AddonDto } from "../../../../constants/dto/items/addon.dto";

import { ReactComponent as AddIcon } from "../../../../assets/plus.svg";
import { ReactComponent as RemoveIcon } from "../../../../assets/minus.svg";

import styles from "./AddonCard.module.css";
import { formatPrice } from "../../../../helpers/general/formatPrice";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

type ExtrasItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type Props = {
  addon: AddonDto;
  orderAdoon?: ExtrasItem;
  setExtraItems: React.Dispatch<React.SetStateAction<ExtrasItem[]>>;
};

const AddonCard = ({ addon, orderAdoon, setExtraItems }: Props) => {
  const [quantity, setQuantity] = useState(orderAdoon?.quantity || 0);
  const { currency } = useSelector((state: RootState) => state.currency);

  return (
    <div className={styles.item}>
      <div className={styles.info}>
        <p className={styles.name}>{addon.name}</p>
        {addon.price > 0 && (
          <p className={styles.price}>
            +{formatPrice(addon.price)} {currency}
          </p>
        )}
      </div>
      <div className={styles.btnBox}>
        {quantity === 0 ? (
          <button
            className={styles.btn}
            onClick={() => {
              setQuantity((prevQuantity) => {
                const quantity = Math.min(50, prevQuantity + 1);
                setExtraItems((prevItems) => {
                  const item = prevItems.find((item) => item.id === addon.id);
                  if (item) {
                    item.quantity = quantity;
                  } else prevItems.push({ ...addon, quantity: quantity });
                  console.log(prevItems);

                  return [...prevItems];
                });
                return quantity;
              });
            }}
          >
            <AddIcon className={styles.icon} />
          </button>
        ) : (
          <>
            <button
              className={styles.btn}
              onClick={() => {
                setQuantity((prevQuantity) => {
                  const quantity = Math.max(0, prevQuantity - 1);
                  setExtraItems((prevItems) => {
                    const itemIndex = prevItems.findIndex(
                      (item) => item.id === addon.id
                    );
                    if (itemIndex !== -1) {
                      if (quantity === 0) prevItems.splice(itemIndex, 1);
                      else prevItems[itemIndex].quantity = quantity;
                    }
                    console.log(prevItems);

                    return [...prevItems];
                  });
                  return quantity;
                });
              }}
            >
              <RemoveIcon className={styles.icon} />
            </button>
            <p className={styles.orderQuantity}>{quantity}</p>
            <button
              className={styles.btn}
              onClick={() => {
                setQuantity((prevQuantity) => {
                  const quantity = Math.min(50, prevQuantity + 1);
                  setExtraItems((prevItems) => {
                    const item = prevItems.find((item) => item.id === addon.id);
                    if (item) {
                      item.quantity = quantity;
                    } else prevItems.push({ ...addon, quantity: quantity });
                    console.log(prevItems);
                    return [...prevItems];
                  });
                  return quantity;
                });
              }}
            >
              <AddIcon className={styles.icon} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddonCard;
