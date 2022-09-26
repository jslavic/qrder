import React from "react";
import Button from "../../../../Common/Buttons/Button/Button";
import { Action } from "../../../../../reducers/modalReducer";

import styles from "../Items.module.css";

import { ReactComponent as DeleteIcon } from "../../../../../assets/delete.svg";
import { ReactComponent as EditIcon } from "../../../../../assets/edit-product.svg";
import { DiscountDto } from "../../../../../constants/dto/items/discount.dto";
import { getDiscountDate } from "../../../../../helpers/discount/getDiscountDate.helper";
import { getDiscountRepeatedString } from "../../../../../helpers/discount/getDiscountRepeatedString";

type Props = {
  discount: DiscountDto;
  modalDispatch: React.Dispatch<Action>;
};

const DiscountItem = ({ discount, modalDispatch }: Props) => {
  const fromDate = new Date(discount.from);
  const toDate = new Date(discount.to);

  return (
    <tr className={styles.row}>
      <td>{discount.name}</td>
      <td>
        {getDiscountRepeatedString(discount.repeated, discount.repeatedDays)}
      </td>
      <td>
        {getDiscountDate(discount.repeated, fromDate)} -{" "}
        {getDiscountDate(discount.repeated, toDate)}
      </td>
      <td>
        {discount.type === "PERCENTAGE"
          ? `${discount.amount}%`
          : `${discount.amount}kn`}
      </td>
      <td align="right" className={styles.buttons}>
        <Button
          className={`${styles.btn__edit} ${styles.btn__editGreen}`}
          onClick={() => {
            modalDispatch({
              type: { field: "DISCOUNT", action: "EDIT" },
              payload: discount,
            });
          }}
        >
          <EditIcon />
        </Button>
        <Button
          className={styles.btn__delete}
          onClick={() => {
            modalDispatch({
              type: { field: "DISCOUNT", action: "DELETE" },
              payload: discount,
            });
          }}
        >
          <DeleteIcon />
        </Button>
      </td>
    </tr>
  );
};

export default DiscountItem;
