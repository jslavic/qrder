import React, { useState } from "react";
import { OrderItemType } from "../../../../constants/types/orderItem.types";
import { formatPrice } from "../../../../helpers/general/formatPrice";
import HistoryStatus from "../HistoryStatus/HistoryStatus";

import { ReactComponent as OpenIcon } from "../../../../assets/chevron-down.svg";
import { ReactComponent as CloseIcon } from "../../../../assets/chevron-up.svg";

import styles from "./HistoryItem.module.css";

type Props = { item: OrderItemType };

const HistoryItem = ({ item }: Props) => {
  const orderDate = new Date(item.createdAt);

  console.log(item.orderedItems[0].discount);

  const [isOpen, setisOpen] = useState(false);

  return (
    <>
      <tr className={styles.item} onClick={() => setisOpen((prev) => !prev)}>
        <td className={styles.location}>{item.location}</td>
        <td className={styles.date}>{orderDate.toLocaleString()}</td>
        <td>
          <HistoryStatus status={item.orderStatus} type={item.orderType} />
        </td>
        <td className={styles.price}>{formatPrice(item.profit)}kn</td>
        <td className={styles.btn}></td>
        <td>
          <button
            className={styles.iconBox}
            onClick={(e) => {
              e.stopPropagation();
              setisOpen((prev) => !prev);
            }}
          >
            {isOpen ? <CloseIcon /> : <OpenIcon />}
          </button>
        </td>
      </tr>
      {isOpen && (
        <>
          <tr className={styles.spacer}></tr>
          <tr>
            <td className={styles.extraInfo} colSpan={7}>
              <div className={styles.header}>
                <p className={styles.orderId}>Narudžba #{item._id.slice(-5)}</p>
                <p className={styles.location}>Lokacija: {item.location}</p>
                <p className={styles.orderedAt}>
                  Naručeno: {orderDate.toLocaleString()}
                </p>
              </div>
              <div>
                <p className={styles.subtitle}>Naručeni proizvodi</p>
                {item.orderedItems.map((product) => (
                  <div className={styles.orderedItem}>
                    <div className={styles.infoBox}>
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className={styles.productImage}
                        />
                      )}
                      <div className={styles.qty}>x{product.quantity}</div>
                      <div className={styles.infoContent}>
                        <p className={styles.name}>{product.name}</p>
                        <div className={styles.extrasBox}>
                          {product.extras &&
                            product.extras.map((extra) => (
                              <div className={styles.extra}>
                                {extra.name} ({extra.quantity}){" "}
                                {extra.price > 0 && (
                                  <span className={styles.extraPrice}>
                                    +{formatPrice(extra.price)}kn
                                  </span>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      {product.discount ? (
                        <>
                          <div className={styles.price}>
                            {formatPrice(product.price * product.quantity)}kn
                          </div>
                          <div className={styles.originalPrice}>
                            (
                            {formatPrice(
                              product.discount.originalPrice * product.quantity
                            )}
                            kn)
                          </div>
                          <p className={styles.discount}>
                            Popust: {product.discount.name} (
                            {product.discount.amount})
                          </p>
                        </>
                      ) : (
                        <div className={styles.price}>
                          {formatPrice(product.price * product.quantity)}kn
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.paymentBox}>
                <div className={styles.revenuesBox}>
                  <div className={styles.revenue}>
                    <span className={styles.revenueDesc}>Ukupna cijena:</span>
                    <span className={styles.profit}>
                      +{formatPrice(item.totalPrice)}kn
                    </span>
                  </div>
                  {item.tip && (
                    <div className={styles.revenue}>
                      <span className={styles.revenueDesc}>Napojnica:</span>
                      <span className={styles.profit}>
                        +{formatPrice(item.tip)}kn
                      </span>
                    </div>
                  )}
                  {item.fees > 0 && (
                    <div className={styles.revenue}>
                      <span className={styles.revenueDesc}>
                        Qrder provizija:
                      </span>
                      <span className={styles.loss}>
                        -{formatPrice(item.fees)}kn
                      </span>
                    </div>
                  )}
                </div>
                <hr style={{ margin: "8px 0" }} />
                <div className={styles.finalRevenue}>
                  <span className={styles.finalRevenue__desc}>Konačno:</span>
                  <span className={styles.finalRevenue__total}>
                    {formatPrice(item.profit)}kn
                  </span>
                </div>
              </div>
            </td>
          </tr>
        </>
      )}
    </>
  );
};

export default HistoryItem;
