import React, { useState } from "react";
import OrderStatusTag from "../OrderStatusTag/OrderStatusTag";
import { OrderItemType } from "../../../../constants/types/orderItem.types";

import styles from "./OrderItem.module.css";

import { ReactComponent as CheckmarkIcon } from "../../../../assets/check.svg";
import { ReactComponent as DeclineIcon } from "../../../../assets/x.svg";
import { ReactComponent as LeftIcon } from "../../../../assets/chevron-left.svg";
import { ReactComponent as RightIcon } from "../../../../assets/chevron-right.svg";
import { formatPrice } from "../../../../helpers/general/formatPrice";
import { OrderStatus } from "../../../../constants/enums/orderEnums/orderStatus.enums";
import { OrderType } from "../../../../constants/enums/orderEnums/orderType.enum";

type Props = {
  order: OrderItemType;
  confirmOrder: (id: string) => void;
  cancelOrder: (id: string) => void;
};

const MAX_LENGTH = 4;

const OrderItem = ({
  order: {
    _id,
    location,
    orderStatus,
    orderType,
    totalPrice,
    createdAt,
    extraNotes,
    orderedItems,
  },
  confirmOrder,
  cancelOrder,
}: Props) => {
  const maxPages = Math.ceil(orderedItems.length / MAX_LENGTH);

  const [paginationPage, setPaginationPage] = useState(0);
  const [showMore, setShowMore] = useState(false);

  const orderedDate = new Date(createdAt);

  return (
    <div className={styles.card}>
      <div>
        <div className={styles.titleBox}>
          <div className={styles.orderInfoBox}>
            <p className={styles.orderLocation}>Lokacija: {location}</p>
            <p className={styles.orderDate}>{orderedDate.toLocaleString()}</p>
          </div>
          <div className={styles.statusBox}>
            <OrderStatusTag status={orderStatus} type={orderType} />
          </div>
        </div>
        {extraNotes && (
          <p className={styles.extraNote}>
            <strong>Poruka kupca:</strong>{" "}
            {extraNotes.length > 40 ? (
              showMore ? (
                <span>
                  {extraNotes}{" "}
                  <button
                    className={styles.showButton}
                    onClick={() => {
                      setShowMore(false);
                    }}
                  >
                    Prikaži manje
                  </button>
                </span>
              ) : (
                <span>
                  {extraNotes.substring(0, 40).trim()}...{" "}
                  <button
                    className={styles.showButton}
                    onClick={() => {
                      setShowMore(true);
                    }}
                  >
                    Prikaži više
                  </button>
                </span>
              )
            ) : (
              <span>{extraNotes}</span>
            )}
          </p>
        )}
        <div className={styles.divider} />
      </div>
      <div
        className={`${styles.items} ${
          maxPages > 1 ? styles.items__maxLength : ""
        }`}
      >
        {orderedItems
          .slice(paginationPage * MAX_LENGTH, (paginationPage + 1) * MAX_LENGTH)
          .map((item) => (
            <div key={item.itemId}>
              <div className={styles.orderContent}>
                <div className={styles.orderDetails}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className={styles.orderItemImg}
                  />
                  <div className={styles.orderItemInfo}>
                    <p className={styles.orderItemName}>{item.name}</p>
                    <p className={styles.orderItemPrice}>
                      Cijena: {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
                <div className={styles.orderQty}>{item.quantity}</div>
              </div>
              {item.extras.length > 0 && (
                <div className={styles.extrasBox}>
                  <p className={styles.extrasTitle}>{item.name} dodatci</p>
                  <ul className={styles.extrasList}>
                    {item.extras.map((extra, i) => (
                      <li className={styles.extrasItem} key={i}>
                        <strong>{extra.name}</strong> ({extra.quantity})
                        <span className={styles.extrasPrice}>
                          <i>
                            {extra.price !== 0 ? `: ${extra.price}HRK` : ""}
                          </i>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        {orderedItems.length > MAX_LENGTH && (
          <div className={styles.paginationBox}>
            <div className={styles.buttons}>
              <button
                className={styles.btn__left}
                onClick={() => {
                  setPaginationPage((prevPage) => {
                    const page = prevPage - 1;
                    if (page === -1) return maxPages - 1;
                    return page;
                  });
                }}
              >
                <LeftIcon />
              </button>
              <button
                className={styles.btn__right}
                onClick={() => {
                  setPaginationPage((prevPage) => {
                    const page = prevPage + 1;
                    if (page === maxPages) return 0;
                    return page;
                  });
                }}
              >
                <RightIcon />
              </button>
            </div>
            <p className={styles.paginationText}>
              Stranica {paginationPage + 1}/{maxPages}
            </p>
          </div>
        )}
      </div>
      <div>
        <div className={styles.divider} />
        <div className={styles.confirmationBox}>
          <div className={styles.priceInfoBox}>
            <p className={styles.price}>
              Cijena: <strong>{formatPrice(totalPrice)}kn</strong>
            </p>
            <p className={styles.amount}>
              Broj proizvoda: {orderedItems.length}
            </p>
          </div>
          {orderStatus === OrderStatus.AWAITING_CONFIRMATION ? (
            <div className={styles.buttonsBox}>
              <button
                className={styles.confirmButton}
                onClick={() => confirmOrder(_id)}
              >
                <CheckmarkIcon />
              </button>
              {orderType === OrderType.CASH && (
                <button
                  className={styles.declineButton}
                  onClick={() => cancelOrder(_id)}
                >
                  <DeclineIcon />
                </button>
              )}
            </div>
          ) : (
            <div className={styles.acceptedBox}>
              <span className={styles.acceptedText}>Potvrđeno</span>
              <CheckmarkIcon className={styles.acceptedIcon} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
