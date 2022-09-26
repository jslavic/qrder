import React, { FormEvent, useEffect, useReducer } from "react";
import validator from "validator";
import BaseModal from "../../../Common/BaseModal/BaseModal";
import InputSection from "../../../Form/InputSection/InputSection";
import {
  formReducer,
  State as StateInterface,
  ActionGeneric,
} from "../../../../reducers/formReucer";
import { StatePropertyValue } from "../../../../constants/types/form.types";
import { getOnChangeHandler } from "../../../../helpers/form/getOnChangeHandler.helper";
import { getOnBlurHandler } from "../../../../helpers/form/getOnBlurHandler.helper";
import Button from "../../../Common/Buttons/Button/Button";
import { validateFormReducer } from "../../../../helpers/form/validateFormReducer";
import { URL } from "../../../../constants/config/url";
import useFetch from "../../../../hooks/useFetch";

import styles from "./BankAccountModal.module.css";
import identityStyles from "../IdentityModal.module.css";

type Props = {
  setBankAccountModal: React.Dispatch<React.SetStateAction<boolean>>;
};

interface State extends StateInterface {
  iban: StatePropertyValue<string>;
  name: StatePropertyValue<string>;
  lastName: StatePropertyValue<string>;
  currency: StatePropertyValue<"hrk" | "eur">;
  type: StatePropertyValue<"individual" | "company">;
}

const getInitialState = (companyCurrency: "hrk" | "eur") => {
  return {
    iban: {
      value: "",
      isTouched: false,
      isValid: false,
      validator: (value) => {
        return (
          validator.isIBAN(value) &&
          value.length === 21 &&
          value.startsWith("HR")
        );
      },
    },
    name: {
      value: "",
      isTouched: false,
      isValid: false,
      validator: (value) => {
        return validator.isLength(value.trim(), { min: 1 });
      },
    },
    lastName: {
      value: "",
      isTouched: false,
      isValid: false,
      validator: (value: string, state: State) => {
        return state.type.value === "company"
          ? true
          : validator.isLength(value.trim(), { min: 1 });
      },
    },
    currency: {
      value: companyCurrency,
      isTouched: false,
      isValid: true,
      validator: (value) => {
        return value === "hrk" || value === "eur";
      },
    },
    type: {
      value: "individual",
      isTouched: false,
      isValid: true,
      validator: (value) => {
        return value === "individual" || value === "company";
      },
    },
  } as State;
};

type FormFields = "website";

const addBankAccountUrl = `${URL}/settings/bank-account`;

const BankAccountModal = ({ setBankAccountModal }: Props) => {
  const { state: fetchState, doFetch } = useFetch<any>(addBankAccountUrl);

  const [formState, dispatchForm] = useReducer<
    React.Reducer<State, ActionGeneric<FormFields>>
  >(formReducer, getInitialState("hrk"));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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
        lastName:
          formState.type.value === "individual"
            ? formState.lastName.value
            : null,
        iban: formState.iban.value,
        currency: formState.currency.value,
        type: formState.type.value,
        countryLocale: "HR",
      }),
    });
  };

  useEffect(() => {
    if (fetchState.data) {
      console.log(fetchState.data);
      setBankAccountModal(false);
    }
  }, [fetchState, setBankAccountModal]);

  return (
    <BaseModal
      closeModal={() => setBankAccountModal(false)}
      className={identityStyles.modal}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Dodajte račun</h2>
        <InputSection
          state={formState.name}
          label={"Ime"}
          type={"text"}
          name={"name"}
          placeholder={
            formState.type.value === "individual"
              ? "Ime vlasnika računa"
              : "Ime kompanije"
          }
          errorText={"Mora biti definirano"}
          onChange={getOnChangeHandler("name", dispatchForm)}
          onBlur={getOnBlurHandler("name", dispatchForm)}
        />
        {formState.type.value === "individual" && (
          <InputSection
            state={formState.lastName}
            label={"Prezime"}
            type={"text"}
            name={"lastName"}
            placeholder={"Prezime vlasnika računa"}
            errorText={"Mora biti definirano"}
            onChange={getOnChangeHandler("lastName", dispatchForm)}
            onBlur={getOnBlurHandler("lastName", dispatchForm)}
          />
        )}
        <InputSection
          state={formState.iban}
          label={"IBAN"}
          type={"text"}
          name={"iban"}
          placeholder={"Npr. HR1210010051863000160"}
          errorText={"Mora biti valjani hrvatski IBAN"}
          onChange={getOnChangeHandler("iban", dispatchForm)}
          onBlur={getOnBlurHandler("iban", dispatchForm)}
        />
        <InputSection
          state={formState.type}
          label={"Tip računa"}
          type={"select"}
          name={"type"}
          placeholder={""}
          errorText={"Mora biti valjani tip računa"}
          onChange={getOnChangeHandler("type", dispatchForm)}
          onBlur={getOnBlurHandler("type", dispatchForm)}
        >
          <option value={"individual"}>Individualac</option>
          <option value={"company"}>Kompanija</option>
        </InputSection>
        <InputSection
          state={formState.currency}
          label={"Valuta"}
          type={"select"}
          name={"currency"}
          placeholder={""}
          errorText={"Mora biti jedna od ponuđenih valuta"}
          onChange={getOnChangeHandler("currency", dispatchForm)}
          onBlur={getOnBlurHandler("currency", dispatchForm)}
        >
          <option value={"hrk"}>Hrvatska kuna</option>
          <option value={"eur"}>Euro</option>
        </InputSection>
        <div className={styles.btnBox}>
          <Button className={identityStyles.btn}>Dodajte</Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default BankAccountModal;
