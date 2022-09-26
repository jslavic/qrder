import React from "react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../../../helpers/general/formatPrice";

import styles from "./AnalyticsSearchProductItem.module.css";

type Props = {
  product: SearchProduct;
};

export type SearchProduct = {
  id: number;
  name: string;
  price: number;
};

const AnalyticsSearchProductItem = ({
  product: { id, name, price },
}: Props) => {
  const navigate = useNavigate();

  return (
    <div
      className={styles.item}
      onClick={() => {
        console.log("runnin");
        navigate(`/dashboard/analytics/product?id=${id}`);
      }}
    >
      <div className={styles.info}>
        <img
          src="https://d17zv3ray5yxvp.cloudfront.net/variants/6niNLYV2F6VaqCoseixK9VVS/57ed05bea98bceae5f0eaada26b69cee6c61471d3030f7123d212844a35eba04"
          alt={name}
          className={styles.img}
        />
        <p className={styles.name}>{name}</p>
      </div>
      <div className={styles.price}>{formatPrice(price)}kn</div>
    </div>
  );
};

export default AnalyticsSearchProductItem;
