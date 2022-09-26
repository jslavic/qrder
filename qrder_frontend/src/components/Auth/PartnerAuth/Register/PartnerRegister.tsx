import React, { useEffect, useReducer } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import validator from "validator";
import { StatePropertyValue } from "../../../../constants/types/form.types";
import { PreselectedPlans } from "../../../../constants/enums/auth.enums";
import { getOnChangeHandler } from "../../../../helpers/form/getOnChangeHandler.helper";
import { getOnBlurHandler } from "../../../../helpers/form/getOnBlurHandler.helper";
import {
  formReducer,
  State as StateInterface,
  ActionGeneric,
} from "../../../../reducers/formReucer";
import Form from "../../../Form/Form";
import InputSection from "../../../Form/InputSection/InputSection";

import styles from "./PartnerRegister.module.css";
import commonStyles from "../../Common.module.css";
import generalStyles from "../../../../styles/general.module.css";
import FormButton from "../../../Common/Buttons/FormButton/FormButton";
import { validateFormReducer } from "../../../../helpers/form/validateFormReducer";

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
  selectedPlan: StatePropertyValue<PreselectedPlans | "">;
  remember: StatePropertyValue<boolean>;
}

type FormFields =
  | "name"
  | "email"
  | "password"
  | "confirmPassword"
  | "selectedPlan"
  | "remember";

const getInitialState = (initialPlan: PreselectedPlans | "") => {
  return {
    name: {
      value: "",
      isTouched: false,
      isValid: false,
      validator: (value) => {
        return validator.isLength(value, { min: 1, max: 50 });
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
    selectedPlan: {
      value: initialPlan,
      isTouched: false,
      isValid: false,
      validator: (value) => {
        return (
          value === PreselectedPlans.PREMIUM ||
          value === PreselectedPlans.STANDARD
        );
      },
    },
    remember: {
      value: false,
      isTouched: true,
      isValid: true,
      validator: (value) => true,
    },
  } as State;
};

interface LocationInterface {
  pathname: string;
  state: { selectedPlan: PreselectedPlans; isFirstReload: true } | null;
}

const PartnerRegister = (props: Props) => {
  const navigate = useNavigate();
  const location = useLocation() as LocationInterface;
  const selectedPlan = location.state?.selectedPlan ?? "";
  const [formState, dispatch] = useReducer<
    React.Reducer<State, ActionGeneric<FormFields>>
  >(formReducer, getInitialState(selectedPlan));

  const handleSubmit = () => {
    // First we mark all fields as touched to give the user feedback on which parts of the form are not correct
    dispatch({ type: "SUBMIT", field: "name" });

    // Check overall form validty with reducer function since if any part is invalid it will return false
    // also run the validator function for some edge cases
    if (!validateFormReducer(formState)) return;

    // Extract only the actual values which will be needed for the payment component
    const redirectState = {} as {
      [key in string]: string | number | number[] | boolean;
    };
    Object.entries(formState).forEach(([key, value]) => {
      redirectState[key] = value.value;
    });
    console.log(redirectState);
    navigate("/partner/register/payment", { state: redirectState });
  };

  /** Since people can preselect plans from the home page,
   *  if a user reloads this page and had a plan pre-selected,
   *  it will return to that plan, we want to avoid this behaviour
   *  to avoid confusion, so we have this code in place in order to
   *  set the plan back to unselected on refresh
   */
  useEffect(() => {
    if (location.state?.isFirstReload)
      navigate(location.pathname, { state: null });
  }, [navigate, location]);

  return (
    <section className={commonStyles.section}>
      <Form
        title={
          <span>
            Postanite <span className={generalStyles.highlight}>Partner</span>
          </span>
        }
        desc={
          <span>
            Pretplatu otkažite <strong>bilo kada!</strong>
          </span>
        }
        onSubmit={handleSubmit}
      >
        <InputSection
          state={formState.name}
          label={"Ime kompanije"}
          type={"text"}
          name={"name"}
          placeholder={"Unesite ime vaše kompanije"}
          errorText={"Unesite ime kompanije koje sadrži do 50 znakova"}
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
        <InputSection
          state={formState.selectedPlan}
          label={"Izaberite plan"}
          type={"select"}
          name={"plan"}
          placeholder={""}
          errorText={"Odaberite plan vaš plan mjesečne pretplate"}
          onChange={getOnChangeHandler("selectedPlan", dispatch)}
          onBlur={getOnBlurHandler("selectedPlan", dispatch)}
          extraContentAfter={
            <p className={styles.currentPrice}>
              Cijena mjesečne pretplate:{" "}
              {formState.selectedPlan.value === PreselectedPlans.STANDARD && (
                <strong>110€</strong>
              )}
              {formState.selectedPlan.value === PreselectedPlans.PREMIUM && (
                <strong>310€</strong>
              )}
            </p>
          }
        >
          <option value="" disabled>
            Odaberite plan pretplate
          </option>
          <option value="STANDARD">Standard</option>
          <option value="PREMIUM">Premium</option>
        </InputSection>

        <FormButton>Registracija</FormButton>
        <div className={styles.endBox}>
          <Link className={styles.link} to={"/partner/login"}>
            Već ste partner? Prijavite se
          </Link>
        </div>
      </Form>
    </section>
  );
};

export default PartnerRegister;
