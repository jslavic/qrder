import React, { useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PreselectedPlans } from "../../../../constants/enums/auth.enums";
import { URL } from "../../../../constants/config/url";
import CheckoutForm from "../../../Form/CheckoutForm/CheckoutForm";
import { CardNumberElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe, StripeElements } from "@stripe/stripe-js";
import { CreateSubscriptionDto } from "../../../../constants/dto/payments/create-subscription.dto";
import IconForm from "../../../Form/IconForm/IconForm";
import LoadingSpinner from "../../../Common/LoadingSpinner/LoadingSpinner";
import {
  statusReducer,
  StatusStates,
} from "../../../../reducers/statusReducer";

import { ReactComponent as ErrorCircle } from "../../../../assets/x-circle.svg";
import { ReactComponent as SuccessCircle } from "../../../../assets/check-circle.svg";

import styles from "./Payments.module.css";
import commonStyles from "../../Common.module.css";
import generalStyles from "../../../../styles/general.module.css";

type Props = {};

interface LocationInterface {
  pathname: string;
  state: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    selectedPlan: PreselectedPlans;
    remember: boolean;
  };
}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

const registerUrl = `${URL}/company-authentication/register`;
const createSubscriptionUrl = `${URL}/subscription/create`;
const activateSubscriptionUrl = `${URL}/subscription/activate`;
const deleteCompanyUrl = `${URL}/company`;

const Payments = (props: Props) => {
  const [statusState, dispatch] = useReducer(
    statusReducer,
    StatusStates.NOT_INITIATED
  );
  const { state } = useLocation() as LocationInterface;
  const navigate = useNavigate();

  useEffect(() => {
    console.log(state);
    if (!state) navigate("/partner/register");
  }, [state, navigate]);

  const handleSubmit = async (stripe: Stripe, elements: StripeElements) => {
    const cardNumberElement = elements.getElement(CardNumberElement);

    dispatch({ type: "loading" });

    if (!cardNumberElement) {
      dispatch({ type: "failed" });
      console.log("nest se sjebalo");
      return;
    }

    // Create a company and customer
    const registerResponse = await fetch(registerUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: state.name,
        email: state.email,
        password: state.password,
        subscriptionPlan: state.selectedPlan,
        countryCode: "hr",
        timezoneOffset: 120,
      }),
    });
    if (!registerResponse.ok) {
      dispatch({ type: "failed" });
      console.log("nest se sjebalo");
      return;
    }

    // Create a payment method
    let { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
      billing_details: {
        name: state.name,
      },
    });

    if (error || !paymentMethod) {
      dispatch({ type: "failed" });
      console.log("nest se sjebalo");
      return;
    }

    // Create subscription
    const subscriptionResponse = await fetch(createSubscriptionUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentMethodId: paymentMethod.id,
      }),
    });
    if (!subscriptionResponse.ok) {
      dispatch({ type: "failed" });
      console.log("nest se sjebalo");
      return;
    }
    const { subscription } =
      (await subscriptionResponse.json()) as CreateSubscriptionDto;

    switch (subscription.status) {
      case "active":
        const activationResponse = await fetch(activateSubscriptionUrl, {
          method: "PATCH",
          credentials: "include",
        });
        if (!activationResponse.ok) {
          dispatch({ type: "failed" });
          console.log("nest se sjebalo");
          return;
        }
        dispatch({ type: "success" });
        break;

      case "incomplete":
        const { error } = await stripe.confirmCardPayment(
          subscription.latest_invoice.payment_intent.client_secret
        );

        if (error) {
          const deletionResponse = await fetch(deleteCompanyUrl, {
            method: "DELETE",
            credentials: "include",
          });
          if (!deletionResponse.ok) {
            dispatch({ type: "failed" });
            console.log("nest se sjebalo");
            return;
          }
          dispatch({ type: "failed" });
        } else {
          console.log("registracija korisnika...");
          const activationResponse = await fetch(activateSubscriptionUrl, {
            method: "PATCH",
            credentials: "include",
          });
          if (!activationResponse.ok) {
            dispatch({ type: "failed" });
            console.log("nest se sjebalo");
            return;
          }
          dispatch({ type: "success" });
        }
        break;

      default:
        dispatch({ type: "failed" });
        console.log(subscription);
    }
  };

  const failedForm = (
    <section className={commonStyles.section}>
      <IconForm
        title={
          <span>
            Transkacija je
            <br />
            <span className={styles.failed}>neuspješna</span>
          </span>
        }
        desc={
          "Nismo mogli uspješno obraditi vašu transakciju, molimo vas provjerite jeste li dobro unijeli detalje i pokušajte ponovo"
        }
        icon={<ErrorCircle />}
      />
    </section>
  );

  const successForm = (
    <section className={commonStyles.section}>
      <IconForm
        title={
          <span>
            Transkacija je
            <br />
            <span className={styles.success}>uspješna</span>
          </span>
        }
        desc={
          "Uspješno ste aktivirali svoju pretplatu, preusmjeravamo vas na vaš račun..."
        }
        icon={<SuccessCircle />}
      />
    </section>
  );

  const loadingForm = (
    <section className={commonStyles.section}>
      <IconForm
        title={
          <span>
            Procesiramo
            <br />
            <span className={generalStyles.highlight}>transakciju</span>
          </span>
        }
        desc={"Molimo vas ne izlazite sa stranice"}
        icon={<LoadingSpinner />}
      />
    </section>
  );

  return (
    <>
      {statusState === StatusStates.LOADING && loadingForm}
      {statusState === StatusStates.ERROR && failedForm}
      {statusState === StatusStates.SUCCESS && successForm}
      <section
        className={commonStyles.section}
        style={{
          display: statusState !== StatusStates.NOT_INITIATED ? "none" : "",
        }}
      >
        <Elements stripe={stripePromise}>
          <CheckoutForm
            pricingPlan={PreselectedPlans.PREMIUM}
            onSubmit={handleSubmit}
            setError={() => {
              dispatch({ type: "failed" });
            }}
          />
        </Elements>
      </section>
    </>
  );
};

export default Payments;
