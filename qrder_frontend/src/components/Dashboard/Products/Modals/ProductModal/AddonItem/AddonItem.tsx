import React, { ChangeEvent } from "react";
import { AddonDto } from "../../../../../../constants/dto/items/addon.dto";

import styles from "../../ModalItems.module.css";

type Props = {
  addon: AddonDto;
  isChecked: boolean;
  changeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
};

const AddonItem = ({ addon, isChecked, changeHandler }: Props) => {
  return (
    <div className={styles.card}>
      <input
        type="checkbox"
        name={"" + addon.id}
        id={"" + addon.id}
        value={addon.id}
        checked={isChecked}
        onChange={changeHandler}
      />
      <div className={styles.info}>
        <p>{addon.name}</p>
        <p>Cijena: {addon.price > 0 ? `${addon.price}kn` : "Besplatno"}</p>
      </div>
      <label htmlFor={"" + addon.id}>
        {isChecked ? (
          <div className={`${styles.btn} ${styles.btn__remove}`}>Ukloni</div>
        ) : (
          <div className={`${styles.btn} ${styles.btn__add}`}>Dodaj</div>
        )}
      </label>
    </div>
  );
};

export default AddonItem;
