import React, { useEffect, useReducer } from "react";
import validator from "validator";
import { URL } from "../../../../constants/config/url";
import { QrDataDto } from "../../../../constants/dto/qrCodes/qrData.dto";
import { StatePropertyValue } from "../../../../constants/types/form.types";
import { getOnBlurHandler } from "../../../../helpers/form/getOnBlurHandler.helper";
import { getOnChangeHandler } from "../../../../helpers/form/getOnChangeHandler.helper";
import useFetch from "../../../../hooks/useFetch";
import {
  formReducer,
  State as StateInterface,
  ActionGeneric,
} from "../../../../reducers/formReucer";
import BaseModal from "../../../Common/BaseModal/BaseModal";
import Button from "../../../Common/Buttons/Button/Button";
import InputSection from "../../../Form/InputSection/InputSection";

import styles from "./TableModal.module.css";

type Props = {
  qrData?: QrDataDto;
  setQrData: React.Dispatch<React.SetStateAction<QrDataDto[]>>;
  closeModal: () => void;
};

interface State extends StateInterface {
  name: StatePropertyValue<string>;
}

type FormFields = "name";

const getInitialState = (initialState?: QrDataDto) => {
  return {
    name: {
      value: initialState?.table.name || "",
      isTouched: false,
      isValid: initialState ? true : false,
      validator: (value) => {
        return validator.isLength(value.trim(), { min: 1 });
      },
    },
  } as State;
};

const tableUrl = `${URL}/table`;

const TableModal = ({ qrData, setQrData, closeModal }: Props) => {
  const [formState, dispatchForm] = useReducer<
    React.Reducer<State, ActionGeneric<FormFields>>
  >(formReducer, getInitialState(qrData));
  const { state: fetchState, doFetch } = useFetch<QrDataDto>(tableUrl);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatchForm({ type: "SUBMIT", field: "name" });
    const getFetchOptions = (method: "POST" | "PATCH") => ({
      method: method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formState.name.value,
      }),
    });
    qrData
      ? doFetch(getFetchOptions("PATCH"), `${tableUrl}/${qrData.table.id}`)
      : doFetch(getFetchOptions("POST"));
  };

  useEffect(() => {
    if (!fetchState.data) return;
    qrData?.table.id
      ? setQrData((prev) => {
          const index = prev.findIndex(
            (item) => item.table.id === qrData.table.id
          );
          if (index !== -1) prev[index] = fetchState.data!;
          return prev;
        })
      : setQrData((prev) => {
          prev.unshift(fetchState.data!);
          return prev;
        });
    closeModal();
  }, [fetchState.data, closeModal, setQrData, qrData]);

  return (
    <form onSubmit={handleSubmit}>
      <BaseModal small closeModal={closeModal}>
        <h2 className={styles.title}>Novi QR Kod</h2>
        <InputSection
          state={formState.name}
          label={"Ime lokacije"}
          type={"text"}
          name={"name"}
          placeholder={"Ime lokacije koju će ovaj QR kod označiti"}
          errorText={"Ime lokacije mora biti definirano"}
          onChange={getOnChangeHandler("name", dispatchForm)}
          onBlur={getOnBlurHandler("name", dispatchForm)}
          inputClassName={styles.input}
        />
        <div className={styles.buttonBox}>
          <Button className={styles.btn__add}>
            {qrData?.table.id ? "Uredi" : "Dodaj"} QR Kod
          </Button>
        </div>
      </BaseModal>
    </form>
  );
};

export default TableModal;
