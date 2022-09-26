import React from "react";
import Button from "../../../../Common/Buttons/Button/Button";
import { Action } from "../../../../../reducers/modalReducer";

import styles from "../Items.module.css";

import { ReactComponent as DeleteIcon } from "../../../../../assets/delete.svg";
import { ReactComponent as EditIcon } from "../../../../../assets/edit-product.svg";
import { AddonDto } from "../../../../../constants/dto/items/addon.dto";

type Props = {
  addon: AddonDto;
  modalDispatch: React.Dispatch<Action>;
};

const AddonItem = ({ addon, modalDispatch }: Props) => {
  return (
    <tr className={styles.row}>
      <td>{addon.name}</td>
      <td>{addon.price > 0 ? `${addon.price}kn` : "Besplatan"}</td>

      <td align="right" className={styles.buttons}>
        <Button
          className={`${styles.btn__edit} ${styles.btn__editBlue}`}
          onClick={() => {
            modalDispatch({
              type: { field: "ADDON", action: "EDIT" },
              payload: addon,
            });
          }}
        >
          <EditIcon />
        </Button>
        <Button
          className={styles.btn__delete}
          onClick={() => {
            modalDispatch({
              type: { field: "ADDON", action: "DELETE" },
              payload: addon,
            });
          }}
        >
          <DeleteIcon />
        </Button>
      </td>
    </tr>
  );
};

export default AddonItem;
