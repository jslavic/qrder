import React, { ChangeEvent } from "react";
import { DiscountDto } from "../../../../../../constants/dto/items/discount.dto";
import { getDiscountDate } from "../../../../../../helpers/discount/getDiscountDate.helper";
import { getDiscountRepeatedString } from "../../../../../../helpers/discount/getDiscountRepeatedString";

import styles from "../../ModalItems.module.css";

type Props = {
  discount: DiscountDto;
  isChecked: boolean;
  changeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
};

const DiscountItem = ({ discount, isChecked, changeHandler }: Props) => {
  const fromDate = new Date(discount.from);
  const toDate = new Date(discount.to);

  return (
    <div className={styles.card}>
      <input
        type="checkbox"
        name={"" + discount.id}
        id={"" + discount.id}
        value={discount.id}
        checked={isChecked}
        onChange={changeHandler}
      />
      <div className={styles.info}>
        <p>
          {discount.name} (
          <strong>
            {discount.type === "PERCENTAGE"
              ? `${discount.amount}%`
              : `${discount.amount}kn`}
          </strong>
          )
        </p>
        <p>
          {getDiscountDate(discount.repeated, fromDate)} -{" "}
          {getDiscountDate(discount.repeated, toDate)}
        </p>
        <p>
          {getDiscountRepeatedString(discount.repeated, discount.repeatedDays)}
        </p>
      </div>
      <label htmlFor={"" + discount.id}>
        {isChecked ? (
          <div className={`${styles.btn} ${styles.btn__remove}`}>Ukloni</div>
        ) : (
          <div className={`${styles.btn} ${styles.btn__add}`}>Primijeni</div>
        )}
      </label>
    </div>
  );
};

export default DiscountItem;
