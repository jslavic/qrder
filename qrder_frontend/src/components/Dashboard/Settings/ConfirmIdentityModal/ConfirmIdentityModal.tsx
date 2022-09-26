import React, {
  FormEvent,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
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

import styles from "../IdentityModal.module.css";

type Props = {
  setConfirmIdentityModal: React.Dispatch<React.SetStateAction<boolean>>;
};

interface State extends StateInterface {
  website: StatePropertyValue<string>;
  firstName: StatePropertyValue<string>;
  lastName: StatePropertyValue<string>;
  date: StatePropertyValue<string>;
  address: StatePropertyValue<string>;
  city: StatePropertyValue<string>;
  postalCode: StatePropertyValue<string>;
}

const getInitialState = () => {
  return {
    website: {
      value: "",
      isTouched: false,
      isValid: false,
      validator: (value) => {
        return (
          validator.isLength(value.trim(), { min: 1 }) && validator.isURL(value)
        );
      },
    },
    firstName: {
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
      validator: (value) => {
        return validator.isLength(value.trim(), { min: 1 });
      },
    },
    date: {
      value: "",
      isTouched: false,
      isValid: false,
      validator: (value) => {
        return (
          validator.isDate(value) && new Date(value).getTime() < Date.now()
        );
      },
    },
    address: {
      value: "",
      isTouched: false,
      isValid: false,
      validator: (value) => {
        return validator.isLength(value.trim(), { min: 1 });
      },
    },
    city: {
      value: "",
      isTouched: false,
      isValid: false,
      validator: (value) => {
        return validator.isLength(value.trim(), { min: 1 });
      },
    },
    postalCode: {
      value: "",
      isTouched: false,
      isValid: false,
      validator: (value) => {
        return validator.isPostalCode(value, "any");
      },
    },
  } as State;
};

type FormFields = "website" | "date" | "address" | "city" | "postalCode";

const confirmIdentityUrl = `${URL}/settings/confirm-account`;

const ConfirmIdentityModal = ({ setConfirmIdentityModal }: Props) => {
  const { state: fetchState, doFetch } = useFetch<any>(confirmIdentityUrl);

  const [formState, dispatchForm] = useReducer<
    React.Reducer<State, ActionGeneric<FormFields>>
  >(formReducer, getInitialState());

  const frontIdInputRef = useRef<HTMLInputElement>(null);
  const backIdInputRef = useRef<HTMLInputElement>(null);

  const [frontIdFile, setFrontIdFile] = useState<File | null>(null);
  const [backIdFile, setBackIdFile] = useState<File | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("started");

    if (!validateFormReducer(formState) || !frontIdFile || !backIdFile) return;

    const formData = new FormData();
    formData.append("url", formState.website.value);
    formData.append("firstName", formState.firstName.value);
    formData.append("lastName", formState.lastName.value);
    formData.append("dateOfBirth", formState.date.value);
    formData.append("address", formState.address.value);
    formData.append("postalCode", formState.postalCode.value);
    formData.append("city", formState.city.value);
    formData.append("verificationFileFront", frontIdFile);
    formData.append("verificationFileBack", backIdFile);

    doFetch({
      method: "POST",
      credentials: "include",
      body: formData,
    });
  };

  useEffect(() => {
    if (fetchState.data) console.log(fetchState.data);
  }, [fetchState]);

  console.log(fetchState);

  return (
    <BaseModal
      closeModal={() => setConfirmIdentityModal(false)}
      className={styles.modal}
    >
      <form onSubmit={handleSubmit}>
        <h2 className={styles.title}>Potvrdite identitent</h2>
        <p className={styles.subtitle}>
          Sve informacije (osim web stranice) odnose se na vlasnika ili neku
          drugu osobu s značajnom ulogom u poslovnici. Ukoliko provjera ne bude
          uspješna morati ćete ispuniti dodatne informacije i dokumente
        </p>
        <InputSection
          state={formState.website}
          label={"Web Stranica Kompanije"}
          type={"url"}
          name={"website"}
          placeholder={
            "Može biti i jedna od vaših društvenih mreža (npr. Instagram, Facebook...)"
          }
          errorText={"Mora biti URL"}
          onChange={getOnChangeHandler("website", dispatchForm)}
          onBlur={getOnBlurHandler("website", dispatchForm)}
        />
        <InputSection
          state={formState.firstName}
          label={"Ime"}
          type={"text"}
          name={"firstName"}
          placeholder={"Ime vlasnika ili neke druge autoritativne osobe"}
          errorText={"Mora biti definirano"}
          onChange={getOnChangeHandler("firstName", dispatchForm)}
          onBlur={getOnBlurHandler("firstName", dispatchForm)}
        />
        <InputSection
          state={formState.lastName}
          label={"Prezime"}
          type={"text"}
          name={"lastName"}
          placeholder={"Prezime osobe"}
          errorText={"Mora biti definirano"}
          onChange={getOnChangeHandler("lastName", dispatchForm)}
          onBlur={getOnBlurHandler("lastName", dispatchForm)}
        />
        <InputSection
          state={formState.date}
          label={"Datum rođenja osobe"}
          type={"date"}
          name={"date"}
          placeholder={""}
          errorText={"Mora biti pravilan datum"}
          onChange={getOnChangeHandler("date", dispatchForm)}
          onBlur={getOnBlurHandler("date", dispatchForm)}
        />
        <InputSection
          state={formState.address}
          label={"Adresa"}
          type={"address"}
          name={"address"}
          placeholder={"Adresa stanovanja"}
          errorText={"Mora biti definirana"}
          onChange={getOnChangeHandler("address", dispatchForm)}
          onBlur={getOnBlurHandler("address", dispatchForm)}
        />
        <div className={styles.twoInputs}>
          <InputSection
            state={formState.city}
            label={"Grad"}
            type={"text"}
            name={"city"}
            placeholder={"Grad stanovanja"}
            errorText={"Mora biti definiran"}
            onChange={getOnChangeHandler("city", dispatchForm)}
            onBlur={getOnBlurHandler("city", dispatchForm)}
            divClassName={styles.largeInput}
          />
          <InputSection
            state={formState.postalCode}
            label={"Poštanski broj"}
            type={"text"}
            name={"postalCode"}
            placeholder={"Poštanski broj"}
            errorText={"Mora biti pravilan poštanski broj"}
            onChange={getOnChangeHandler("postalCode", dispatchForm)}
            onBlur={getOnBlurHandler("postalCode", dispatchForm)}
          />
        </div>
        <div className={styles.fileSection}>
          <label htmlFor="frontId">
            Prednja strana identifikacijskog dokumenta
          </label>
          <input
            ref={frontIdInputRef}
            onChange={() => {
              const files = frontIdInputRef.current!.files;
              if (files && files.length > 0) {
                setFrontIdFile(files[0]);
              }
            }}
            type="file"
            name="frontId"
            id="frontId"
            capture="environment"
            accept="image/*"
          />
        </div>
        <div className={styles.fileSection}>
          <label htmlFor="backId">
            Stražnja strana identifikacijskog dokumenta
          </label>
          <input
            ref={backIdInputRef}
            onChange={() => {
              const files = backIdInputRef.current!.files;
              if (files && files.length > 0) {
                setBackIdFile(files[0]);
              }
            }}
            type="file"
            name="backId"
            id="backId"
            capture="environment"
            accept="image/*"
          />
        </div>
        <div className={styles.acceptedDocuemnts}>
          <p className={styles.documentTitle}>
            Prihvaćeni identifikacijski dokumenti:
          </p>
          <ul className={styles.documentList}>
            <li>Hrvatska putovnica</li>
            <li>Vozačka dozvola</li>
            <li>Osobna iskaznica</li>
            <li>Dozvola boravka</li>
          </ul>
        </div>
        <div>
          <Button className={styles.btn}>Potvrdi</Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default ConfirmIdentityModal;
