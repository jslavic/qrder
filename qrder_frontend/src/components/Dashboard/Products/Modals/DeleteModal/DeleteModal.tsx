import React, { useEffect } from "react";
import { URL } from "../../../../../constants/config/url";
import { AddonDto } from "../../../../../constants/dto/items/addon.dto";
import { DiscountDto } from "../../../../../constants/dto/items/discount.dto";
import { ProductDto } from "../../../../../constants/dto/items/product.dto";
import useFetch from "../../../../../hooks/useFetch";
import Button from "../../../../Common/Buttons/Button/Button";
import BaseModal from "../../../../Common/BaseModal/BaseModal";

import styles from "./DeleteModal.module.css";

type Props = {
  type: "PRODUCT" | "DISCOUNT" | "ADDON";
  item: ProductDto | DiscountDto | AddonDto;
  deleteItem: () => void;
  closeModal: () => void;
};

const DeleteModal = ({ item, type, deleteItem, closeModal }: Props) => {
  let productType: string;
  let url: string;
  switch (type) {
    case "PRODUCT":
      productType = "proizvod";
      url = `${URL}/product/${item.id}`;
      break;
    case "DISCOUNT":
      productType = "popust";
      url = `${URL}/discount/${item.id}`;
      break;
    case "ADDON":
      productType = "dodatak";
      url = `${URL}/addon/${item.id}`;
      break;
  }

  const { state: fetchState, doFetch } = useFetch<
    ProductDto | DiscountDto | AddonDto
  >(url);

  const handleSubmit = async () => {
    doFetch({
      method: "DELETE",
      credentials: "include",
    });
  };

  useEffect(() => {
    if (!fetchState.data) return;
    deleteItem();
    closeModal();
  }, [fetchState.data, closeModal, deleteItem]);

  return (
    <BaseModal small className={styles.content} closeModal={closeModal}>
      <h2 className={styles.title}>
        Jeste li sigurni da želite izbrisati {productType}{" "}
        <span className={styles.highlighted}>{item.name}</span>?
      </h2>
      <div className={styles.buttons}>
        <Button className={styles.btn__cancel} onClick={closeModal}>
          Otkaži
        </Button>
        <Button className={styles.btn__confirm} onClick={handleSubmit}>
          Obriši
        </Button>
      </div>
    </BaseModal>
  );
};

export default DeleteModal;
