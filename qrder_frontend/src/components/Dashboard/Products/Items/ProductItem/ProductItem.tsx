import React from "react";
import Button from "../../../../Common/Buttons/Button/Button";
import { Action } from "../../../../../reducers/modalReducer";

import styles from "../Items.module.css";

import { ReactComponent as DeleteIcon } from "../../../../../assets/delete.svg";
import { ReactComponent as EditIcon } from "../../../../../assets/edit-product.svg";
import { ProductDto } from "../../../../../constants/dto/items/product.dto";

type Props = {
  product: ProductDto;
  modalDispatch: React.Dispatch<Action>;
};

const ProductItem = ({ product, modalDispatch }: Props) => {
  const createdDate = new Date(product.createdAt);
  console.log(product.imageUrl);
  return (
    <tr className={styles.row}>
      <td>
        <img
          src={product.imageUrl || ""}
          alt={product.name}
          className={styles.image}
        />
      </td>
      <td>{product.name}</td>
      <td>{product.price}kn</td>
      <td>{product.description}</td>
      <td>{createdDate.toLocaleDateString()}</td>
      <td align="right" className={styles.buttons}>
        <Button
          className={styles.btn__edit}
          onClick={() => {
            modalDispatch({
              type: { field: "PRODUCT", action: "EDIT" },
              payload: product,
            });
          }}
        >
          <EditIcon />
        </Button>
        <Button
          className={styles.btn__delete}
          onClick={() => {
            modalDispatch({
              type: { field: "PRODUCT", action: "DELETE" },
              payload: product,
            });
          }}
        >
          <DeleteIcon />
        </Button>
      </td>
    </tr>
  );
};

export default ProductItem;
