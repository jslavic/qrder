import React from "react";
import Form from "../Form";
import FormButton from "../../Common/Buttons/FormButton/FormButton";
import { PreselectedPlans } from "../../../constants/enums/auth.enums";
import { getPlansPricing } from "../../../helpers/form/getPlansPricing";
import { toTitleCase } from "../../../helpers/general/toTitleCase";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Stripe, StripeElements } from "@stripe/stripe-js";

import styles from "./CheckoutForm.module.css";
import commonStyles from "../Common.module.css";

type Props = {
  pricingPlan: PreselectedPlans;
  onSubmit: (stripe: Stripe, elements: StripeElements) => {};
  setError: () => void;
};

const cardNumberStyling = {
  showIcon: true,
  placeholder: "Molimo vas unesite broj kartice",
  style: {
    base: {
      fontSize: "15px",
      iconColor: "#7f5eff",
    },
  },
};

/**
 * Please keep in mind that this element will have a bad seperation of concerns
 * due to the way that Stripe elements require them to already be inside of the
 * form and the form box in order to start their loading proccess. In the case
 * that an alternative method to load Stripe elements wihtout having to pre-render
 * them does get added in the future, **please consider refactoring this component
 * in order to maintain good seperation of concerns**
 */

const CheckoutForm = ({ pricingPlan, onSubmit, setError }: Props) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError();
      return;
    }
    onSubmit(stripe, elements);
  };

  return (
    <Form
      title={
        <span className={styles.planTitle}>
          Preplata na
          <span className={styles.planHightlight}>
            {toTitleCase(pricingPlan)} Plan
          </span>
        </span>
      }
      desc={
        <span style={{ textAlign: "center" }}>
          Osigurano pomoću{" "}
          <a className={styles.checkoutLink} href="https://stripe.com/">
            Stripea
          </a>
        </span>
      }
      onSubmit={handleSubmit}
    >
      <div className={commonStyles.formInputBox}>
        <div className={styles.fieldWrapper}>
          <label htmlFor="number">Broj kartice</label>
          <CardNumberElement
            id="number"
            className={styles.input}
            options={cardNumberStyling}
          />
        </div>
        <div
          className={`${styles.fieldWrapper} ${styles.fieldWrapper__twoInputs}`}
        >
          <div className={styles.expBox}>
            <label htmlFor="expDate">Datum isteka kartice</label>
            <CardExpiryElement id="expDate" className={styles.input} />
          </div>
          <div className={styles.cvcBox}>
            <label htmlFor="CVC">CVC</label>
            <CardCvcElement id="CVC" className={styles.input} />
          </div>
        </div>

        <div className={styles.extra}>
          <p className={styles.priceBox}>
            <span className={styles.priceText}>Mjesečna cijena pretplate:</span>
            <span className={styles.priceAmount}>
              {`${getPlansPricing(pricingPlan)}€`}
            </span>
          </p>
          <FormButton>Potvrdite pretplatu</FormButton>
          <p className={styles.disclaimer}>
            Pretplatu možete otkazati bilo kada uz 100% povrata novca
          </p>
        </div>
      </div>
    </Form>
  );
};

export default CheckoutForm;
