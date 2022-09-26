import React, { ChangeEvent } from "react";
import { ProductDto } from "../../../../../constants/dto/items/product.dto";

import styles from "../ModalItems.module.css";

type Props = {
  product: ProductDto;
  isChecked: boolean;
  changeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
};

const ModalProductItem = ({ product, isChecked, changeHandler }: Props) => {
  return (
    <div className={styles.card}>
      <input
        type="checkbox"
        name={"" + product.id}
        id={"" + product.id}
        value={product.id}
        checked={isChecked}
        onChange={changeHandler}
      />
      <div className={styles.info}>
        <p>{product.name}</p>
        <p>{product.price}kn</p>
      </div>
      <label htmlFor={"" + product.id}>
        {isChecked ? (
          <div className={`${styles.btn} ${styles.btn__remove}`}>Ukloni</div>
        ) : (
          <div className={`${styles.btn} ${styles.btn__add}`}>Primijeni</div>
        )}
      </label>
    </div>
  );
};

export default ModalProductItem;
