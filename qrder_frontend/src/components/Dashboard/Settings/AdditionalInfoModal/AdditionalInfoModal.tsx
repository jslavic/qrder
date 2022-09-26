import React, {
  FormEvent,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { URL } from "../../../../constants/config/url";
import { StatePropertyValue } from "../../../../constants/types/form.types";
import useFetch from "../../../../hooks/useFetch";
import validator from "validator";
import {
  formReducer,
  State as StateInterface,
  ActionGeneric,
} from "../../../../reducers/formReucer";
import Button from "../../../Common/Buttons/Button/Button";
import InputSection from "../../../Form/InputSection/InputSection";
import { getOnChangeHandler } from "../../../../helpers/form/getOnChangeHandler.helper";
import { getOnBlurHandler } from "../../../../helpers/form/getOnBlurHandler.helper";
import PhoneInput, {
  isPossiblePhoneNumber,
  formatPhoneNumberIntl,
} from "react-phone-number-input";
import BaseModal from "../../../Common/BaseModal/BaseModal";
import { validateFormReducer } from "../../../../helpers/form/validateFormReducer";

import styles from "../IdentityModal.module.css";
import "react-phone-number-input/style.css";
import { useNavigate } from "react-router-dom";

type Props = {
  setConfirmIdentityModal: React.Dispatch<React.SetStateAction<boolean>>;
};

interface State extends StateInterface {
  email: StatePropertyValue<string>;
  phone: StatePropertyValue<string>;
}

const getInitialState = (accountRequirements: string[]) => {
  const initialState = {} as State;
  if (accountRequirements.includes("individual.email"))
    initialState.email = {
      value: "",
      isTouched: false,
      isValid: false,
      validator: (value) => {
        return validator.isEmail(value);
      },
    };
  if (accountRequirements.includes("individual.phone"))
    initialState.phone = {
      value: "",
      isTouched: false,
      isValid: false,
      validator: (value) => {
        return isPossiblePhoneNumber(value);
      },
    };
  return initialState;
};

type FormFields = "email" | "phone";

type FetchState = {
  accountRequirements?: string[];
};

const additionalRequirementsUrl = `${URL}/settings/additional-requirements`;

const AdditionalInfoModal = ({ setConfirmIdentityModal }: Props) => {
  const { state: fetchState, doFetch } = useFetch<FetchState>(
    additionalRequirementsUrl
  );

  const [additionalRequirements, setAdditionalRequirements] = useState<
    string[]
  >([]);

  const navigate = useNavigate();

  useEffect(() => {
    doFetch({ method: "GET", credentials: "include" });
  }, [doFetch]);

  useEffect(() => {
    if (fetchState.data?.accountRequirements) {
      if (fetchState.data.accountRequirements === null) navigate(0);
      setAdditionalRequirements(fetchState.data.accountRequirements);
    }
  }, [fetchState, setConfirmIdentityModal, navigate]);

  console.log(fetchState);

  return (
    <BaseModal
      closeModal={() => setConfirmIdentityModal(false)}
      className={styles.modal}
    >
      {fetchState.isLoading && <div>Učitavanje</div>}
      {additionalRequirements.length !== 0 && (
        <AdditionalInfoForm
          accountRequirements={additionalRequirements}
          doFetch={doFetch}
        />
      )}
    </BaseModal>
  );
};

type AdditionalInfoFormProps = {
  accountRequirements: string[];
  doFetch: (options?: {}, altUrl?: string | null) => void;
};

const AdditionalInfoForm = ({
  accountRequirements,
  doFetch,
}: AdditionalInfoFormProps) => {
  const [formState, dispatchForm] = useReducer<
    React.Reducer<State, ActionGeneric<FormFields>>
  >(formReducer, getInitialState(accountRequirements));

  const frontIdInputRef = useRef<HTMLInputElement>(null);
  const backIdInputRef = useRef<HTMLInputElement>(null);

  const [frontIdFile, setFrontIdFile] = useState<File | null>(null);
  const [backIdFile, setBackIdFile] = useState<File | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateFormReducer(formState)) return;

    const formData = new FormData();

    console.log(
      formState.email.value,
      formState.phone.value,
      frontIdFile,
      backIdFile
    );

    if (
      accountRequirements.includes(
        "individual.verification.additional_document"
      )
    ) {
      if (!frontIdFile || !backIdFile) return;
      console.log("adding files");
      formData.append("verificationFileFront", frontIdFile);
      formData.append("verificationFileBack", backIdFile);
    }
    if (formState.email) formData.append("email", formState.email.value);
    if (formState.phone)
      formData.append("phone", formatPhoneNumberIntl(formState.phone.value));

    console.log("came");

    doFetch({
      method: "POST",
      credentials: "include",
      body: formData,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className={styles.title}>Potvrdite identitent</h2>
      <p className={styles.subtitle}>
        Sve informacije odnose se na vlasnika ili neku drugu osobu s značajnom
        ulogom u poslovnici. Ukoliko ova dodatna provjera ne bude uspješna
        morati ćete osobno kontaktirati Qrder kako bi vam pomogli s vašim
        problemlima
      </p>
      {formState.email && (
        <InputSection
          state={formState.email}
          label={"Email"}
          type={"email"}
          name={"email"}
          placeholder={"Email vlasnika ili druge osobe s značajnom ulogom"}
          errorText={"Mora biti email"}
          onChange={getOnChangeHandler("email", dispatchForm)}
          onBlur={getOnBlurHandler("email", dispatchForm)}
        />
      )}
      {formState.phone && (
        <>
          <label htmlFor="phone" className={styles.phoneLabel}>
            Broj mobitela
          </label>
          <PhoneInput
            className={`${styles.phoneWrapper} ${
              !formState.phone.isValid && formState.phone.isTouched
                ? styles.invalid
                : ""
            }`}
            placeholder="Broj mobitela iste osobe"
            id="phone"
            value={formState.phone.value}
            defaultCountry="HR"
            onChange={(value) => {
              dispatchForm({
                type: "INPUT",
                field: "phone",
                payload: "" + value,
              });
            }}
            onBlur={() => {
              dispatchForm({ type: "BLUR", field: "phone" });
            }}
          />
        </>
      )}
      {accountRequirements.includes(
        "individual.verification.additional_document"
      ) && (
        <>
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
        </>
      )}
      <div>
        <Button className={styles.btn}>Potvrdi</Button>
      </div>
    </form>
  );
};

export default AdditionalInfoModal;
