import React from "react";
import { ProductForOrderDto } from "../../../constants/dto/items/product-for-order.dto";

import { ReactComponent as AddIcon } from "../../../assets/plus.svg";
import { ReactComponent as RemoveIcon } from "../../../assets/minus.svg";

import styles from "./MenuItem.module.css";
import { MenuItemType } from "../Menu";
import { formatPrice } from "../../../helpers/general/formatPrice";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

type Props = {
  product: ProductForOrderDto;
  orderItem?: MenuItemType;
  onAddItem: (item: MenuItemType) => void;
  modalOpen: () => void;
};

const MenuItem = ({ product, orderItem, onAddItem, modalOpen }: Props) => {
  const { currency } = useSelector((state: RootState) => state.currency);

  const loremText =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe quasi similique repellat earum assumenda ea delectus perspiciatis placeat veritatis aspernatur, eum ipsa molestias odio debitis fuga? Numquam quia sequi inventore?";

  return (
    <div className={styles.item} onClick={modalOpen}>
      <div className={styles.infoBox}>
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.productImage}
          />
        )}
        <div className={styles.infoText}>
          <p className={styles.titleBox}>
            <span className={styles.title}>{product.name} </span>
            {product.discount && (
              <span className={styles.discount}>
                -{product.discount.discountAmount}
              </span>
            )}
          </p>
          <p className={styles.desc}>
            {loremText.length > 50
              ? `${loremText.substring(0, 120).trim()}...`
              : loremText}
          </p>
        </div>
      </div>
      <div className={styles.actionBox}>
        <div className={styles.discoutBox}>
          {product.discount ? (
            <>
              <p className={styles.price}>
                {formatPrice(product.discount.discountPrice)}
                {currency}
              </p>
              <p className={styles.originalPrice}>
                ({formatPrice(product.price)}
                {currency})
              </p>
            </>
          ) : (
            <p className={styles.price}>
              {formatPrice(product.price)}
              {currency}
            </p>
          )}
        </div>
        <div className={styles.btnBox}>
          {orderItem && (
            <>
              <button
                className={styles.btn}
                onClick={(e) => {
                  e.stopPropagation();
                  const productPrice = product.discount
                    ? product.discount.discountPrice
                    : product.price;
                  onAddItem({
                    ...orderItem,
                    quantity: orderItem.quantity - 1,
                    fullPrice: orderItem.fullPrice - productPrice,
                  });
                }}
              >
                <RemoveIcon className={styles.icon} />
              </button>
              <p className={styles.orderQuantity}>{orderItem.quantity}</p>
            </>
          )}
          <button
            className={styles.btn}
            onClick={(e) => {
              e.stopPropagation();
              const productPrice = product.discount
                ? product.discount.discountPrice
                : product.price;
              orderItem
                ? onAddItem({
                    ...orderItem,
                    quantity: (orderItem.quantity || 0) + 1,
                    fullPrice: (orderItem.fullPrice || 0) + productPrice,
                  })
                : onAddItem({
                    ...product,
                    quantity: 1,
                    fullPrice: productPrice,
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

export default MenuItem;
