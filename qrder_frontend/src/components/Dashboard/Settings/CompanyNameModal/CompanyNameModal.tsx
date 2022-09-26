import React, { useEffect, useReducer } from "react";
import validator from "validator";
import { URL } from "../../../../constants/config/url";
import { QrDataDto } from "../../../../constants/dto/qrCodes/qrData.dto";
import { StatePropertyValue } from "../../../../constants/types/form.types";
import { getOnBlurHandler } from "../../../../helpers/form/getOnBlurHandler.helper";
import { getOnChangeHandler } from "../../../../helpers/form/getOnChangeHandler.helper";
import { validateFormReducer } from "../../../../helpers/form/validateFormReducer";
import useFetch from "../../../../hooks/useFetch";
import {
  formReducer,
  State as StateInterface,
  ActionGeneric,
} from "../../../../reducers/formReucer";
import BaseModal from "../../../Common/BaseModal/BaseModal";
import Button from "../../../Common/Buttons/Button/Button";
import InputSection from "../../../Form/InputSection/InputSection";

import styles from "./CompanyNameModal.module.css";

type Props = {
  closeModal: () => void;
};

interface State extends StateInterface {
  name: StatePropertyValue<string>;
}

type FormFields = "name";

const getInitialState = () => {
  return {
    name: {
      value: "",
      isTouched: false,
      isValid: false,
      validator: (value) => {
        return validator.isLength(value.trim(), { min: 1 });
      },
    },
  } as State;
};

const tableUrl = `${URL}/table`;

const CompanyNameModal = ({ closeModal }: Props) => {
  const [formState, dispatchForm] = useReducer<
    React.Reducer<State, ActionGeneric<FormFields>>
  >(formReducer, getInitialState());
  const { state: fetchState, doFetch } = useFetch<QrDataDto>(tableUrl);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateFormReducer(formState)) return;

    doFetch({
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formState.name.value,
      }),
    });
  };

  useEffect(() => {
    if (!fetchState.data) return;
    closeModal();
  }, [fetchState.data, closeModal]);

  return (
    <form onSubmit={handleSubmit}>
      <BaseModal small closeModal={closeModal}>
        <h2 className={styles.title}>Promjena imena</h2>
        <InputSection
          state={formState.name}
          label={"Ime"}
          type={"text"}
          name={"name"}
          placeholder={"Novo ime kompanije"}
          errorText={"Ime kompanije mora biti definirano"}
          onChange={getOnChangeHandler("name", dispatchForm)}
          onBlur={getOnBlurHandler("name", dispatchForm)}
          inputClassName={styles.input}
        />
        <div className={styles.buttonBox}>
          <Button className={styles.btn__add}>Potvrdite</Button>
        </div>
      </BaseModal>
    </form>
  );
};

export default CompanyNameModal;
