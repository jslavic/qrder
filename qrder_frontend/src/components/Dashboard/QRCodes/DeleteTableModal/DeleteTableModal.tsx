import React, { useEffect } from "react";
import { URL } from "../../../../constants/config/url";
import useFetch from "../../../../hooks/useFetch";
import Button from "../../../Common/Buttons/Button/Button";
import BaseModal from "../../../Common/BaseModal/BaseModal";

import styles from "./DeleteTableModal.module.css";
import { TableDto } from "../../../../constants/dto/qrCodes/table.dto";
import { QrDataDto } from "../../../../constants/dto/qrCodes/qrData.dto";

type Props = {
  qrData: QrDataDto;
  setQrData: React.Dispatch<React.SetStateAction<QrDataDto[]>>;
  closeModal: () => void;
};

const tableUrl = `${URL}/table`;

const DeleteTableModal = ({ qrData, setQrData, closeModal }: Props) => {
  const { state: fetchState, doFetch } = useFetch<TableDto>(
    `${tableUrl}/${qrData.table.id}`
  );

  const handleSubmit = async () => {
    doFetch({
      method: "DELETE",
      credentials: "include",
    });
  };

  useEffect(() => {
    if (!fetchState.data) return;
    setQrData((prev) => {
      const index = prev.findIndex((item) => item.table.id === qrData.table.id);
      if (index !== -1) prev.splice(index, 1);
      return prev;
    });
    closeModal();
  }, [fetchState.data, closeModal, setQrData, qrData]);

  return (
    <BaseModal small className={styles.content} closeModal={closeModal}>
      <h2 className={styles.title}>
        Jeste li sigurni da želite izbrisati{" "}
        <span className={styles.highlighted}>{qrData.table.name}</span>?
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

export default DeleteTableModal;
