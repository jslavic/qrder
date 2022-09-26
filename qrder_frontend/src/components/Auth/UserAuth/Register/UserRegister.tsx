import React, { useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import validator from "validator";
import { StatePropertyValue } from "../../../../constants/types/form.types";
import { getOnChangeHandler } from "../../../../helpers/form/getOnChangeHandler.helper";
import { getOnBlurHandler } from "../../../../helpers/form/getOnBlurHandler.helper";
import {
  formReducer,
  State as StateInterface,
  ActionGeneric,
} from "../../../../reducers/formReucer";
import Form from "../../../Form/Form";
import InputSection from "../../../Form/InputSection/InputSection";

import styles from "./UserRegister.module.css";
import commonStyles from "../../Common.module.css";
import generalStyles from "../../../../styles/general.module.css";
import FormButton from "../../../Common/Buttons/FormButton/FormButton";
import { validateFormReducer } from "../../../../helpers/form/validateFormReducer";
import useFetch from "../../../../hooks/useFetch";
import { URL } from "../../../../constants/config/url";
import { UserLoginDto } from "../../../../constants/dto/user/login.dto";

type Props = {};

interface State extends StateInterface {
  name: StatePropertyValue<string>;
  email: StatePropertyValue<string>;
  password: StatePropertyValue<string>;
  confirmPassword: {
    value: string;
    isTouched: boolean;
    isValid: boolean;
    validator: (value: any, state?: StateInterface) => boolean;
  };
}

type FormFields = "name" | "email" | "password" | "confirmPassword";

const getInitialState = () => {
  return {
    name: {
      value: "",
      isTouched: false,
      isValid: false,
      validator: (value) => {
        const pattern = new RegExp(/^[a-zA-Z\sčćžđšČĆŽĐŠ]*$/);
        return pattern.test(value);
      },
    },
    email: {
      value: "",
      isTouched: false,
      isValid: false,
      validator: (value) => {
        return validator.isEmail(value);
      },
    },
    password: {
      value: "",
      isTouched: false,
      isValid: false,
      validator: (value) => {
        const pattern = new RegExp(
          "^(?=(.*[a-zA-Z]){1,})(?=(.*[0-9]){1,}).{8,}$"
        );
        return pattern.test(value);
      },
    },
    confirmPassword: {
      value: "",
      isTouched: false,
      isValid: false,
      validator: (value: string, state?: State) => {
        if (!state) return false;
        return value === state.password.value;
      },
    },
  } as State;
};

const registerUrl = `${URL}/user-authentication/register`;

const UserRegister = (props: Props) => {
  const [formState, dispatch] = useReducer<
    React.Reducer<State, ActionGeneric<FormFields>>
  >(formReducer, getInitialState());
  const { state: fetchState, doFetch } = useFetch<UserLoginDto>(registerUrl);

  const handleSubmit = () => {
    // First we mark all fields as touched to give the user feedback on which parts of the form are not correct
    dispatch({ type: "SUBMIT", field: "name" });

    // Check overall form validty with reducer function since if any part is invalid it will return false
    // also run the validator function for some edge cases
    if (!validateFormReducer(formState)) return;

    // Register user
    doFetch({
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formState.name.value.trim(),
        email: formState.email.value,
        password: formState.password.value,
        confirmPassword: formState.confirmPassword.value,
      }),
    });
  };

  useEffect(() => {
    if (fetchState.data) console.log(fetchState.data);
  }, [fetchState.data]);

  return (
    <section className={commonStyles.section}>
      <Form
        title={
          <span>
            Postanite <span className={generalStyles.highlight}>Korisnik</span>
          </span>
        }
        onSubmit={handleSubmit}
      >
        <InputSection
          state={formState.name}
          label={"Ime"}
          type={"text"}
          name={"name"}
          placeholder={"Vaše ime kojime ćete se identificirati"}
          errorText={"Unesite ime koje sadrži samo slova i razamke"}
          onChange={getOnChangeHandler("name", dispatch)}
          onBlur={getOnBlurHandler("name", dispatch)}
        />
        <InputSection
          state={formState.email}
          label={"Email"}
          type={"email"}
          name={"email"}
          placeholder={"mail@adresa.com"}
          errorText={"Unesite važeću mail adresu"}
          onChange={getOnChangeHandler("email", dispatch)}
          onBlur={getOnBlurHandler("email", dispatch)}
        />
        <InputSection
          state={formState.password}
          label={"Lozinka"}
          type={"password"}
          name={"password"}
          placeholder={"Min. 8 znakova"}
          errorText={
            "Lozinka mora sadržavati između 8 i 30 znakova te barem jedan od tih znakova mora biti broj"
          }
          onChange={getOnChangeHandler("password", dispatch)}
          onBlur={getOnBlurHandler("password", dispatch)}
        />
        <InputSection
          state={formState.confirmPassword}
          label={"Potvrdite lozinku"}
          type={"password"}
          name={"confirmPassword"}
          placeholder={"Ponovite lozinku"}
          errorText={"Lozinke se moraju podudarati"}
          onChange={getOnChangeHandler("confirmPassword", dispatch)}
          onBlur={getOnBlurHandler("confirmPassword", dispatch)}
        />

        <FormButton>Registracija</FormButton>
        <div className={styles.endBox}>
          <Link className={styles.link} to={"/user/login"}>
            Već ste registrirani kupac? Prijavite se
          </Link>
        </div>
      </Form>
    </section>
  );
};

export default UserRegister;
