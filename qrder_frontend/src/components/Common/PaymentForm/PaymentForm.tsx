import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, Stripe, StripeCardNumberElement } from "@stripe/stripe-js";
import React, { FormEvent, useState } from "react";
import Button from "../../Common/Buttons/Button/Button";

import { ReactComponent as ErrorIcon } from "../../../assets/x-circle.svg";
import { ReactComponent as RetryIcon } from "../../../assets/retry.svg";

import styles from "./PaymentForm.module.css";
import LoadingSpinner from "../../Common/LoadingSpinner/LoadingSpinner";

type Props = {
  onSubmit: (
    cardNumberElement: StripeCardNumberElement,
    stripe: Stripe,
    setPaymentError: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  title: string;
  loadingText: string;
  errorText: string;
  btnText: string;
  desc?: string;
  extraContent?: React.ReactNode;
};

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

const PaymentForm = ({
  onSubmit,
  title,
  loadingText,
  errorText,
  btnText,
  desc,
  extraContent,
}: Props) => {
  return (
    <Elements stripe={stripePromise}>
      <CardForm
        onSubmit={onSubmit}
        title={title}
        loadingText={loadingText}
        errorText={errorText}
        btnText={btnText}
        desc={desc}
        extraContent={extraContent}
      />
    </Elements>
  );
};

type CardFormProps = {
  onSubmit: (
    cardNumberElement: StripeCardNumberElement,
    stripe: Stripe,
    setPaymentError: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  title: string;
  loadingText: string;
  errorText: string;
  btnText: string;
  desc?: string;
  extraContent?: React.ReactNode;
};

const cardNumberStyling = {
  showIcon: true,
  placeholder: "Broj kartice",
};

const textColor = "#1a1a1a";

const CardForm = ({
  onSubmit,
  title,
  loadingText,
  errorText,
  btnText,
  desc,
  extraContent,
}: CardFormProps) => {
  const [paymentError, setPaymentError] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const isLoaded = !!(stripe && elements);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return setPaymentError(true);

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) return setPaymentError(true);

    await onSubmit(cardNumberElement, stripe, setPaymentError);
  };

  const handleFormReload = () => {
    setPaymentError(false);
    setPaymentLoading(false);
  };

  return (
    <>
      {!isLoaded && (
        <div className={styles.centered}>
          <LoadingSpinner size={60} />
          <p className={styles.text}>Učitavanje...</p>
        </div>
      )}
      {paymentLoading && !paymentError && (
        <div className={styles.centered}>
          <LoadingSpinner size={60} />
          <p className={styles.text}>{loadingText}</p>
        </div>
      )}
      {paymentError && (
        <div className={styles.centered}>
          <ErrorIcon className={styles.icon} />
          <p className={styles.textError}>{errorText}</p>
          <Button
            className={`${styles.btn} ${styles.btn__error}`}
            onClick={handleFormReload}
          >
            <RetryIcon className={styles.retryIcon} />
            Pokušajte ponovo
          </Button>
        </div>
      )}
      <form
        onSubmit={async (e) => {
          setPaymentLoading(true);
          await handleSubmit(e);
          setPaymentLoading(false);
        }}
        className={styles.formContent}
        style={
          paymentError || paymentLoading || !isLoaded
            ? { visibility: "hidden" }
            : {}
        }
      >
        <div className={styles.titleBox}>
          <h2 className={styles.title}>{title}</h2>
          {desc && <p className={styles.desc}>{desc}</p>}
        </div>
        <div className={styles.formContent}>
          <div className={styles.formInputBox}>
            <div className={styles.fieldWrapper}>
              <label htmlFor="number">Broj kartice</label>
              <CardNumberElement
                id="number"
                className={styles.input}
                options={{
                  ...cardNumberStyling,
                  style: {
                    base: {
                      fontSize: "15px",
                      iconColor: "#7f5eff",
                      color: textColor,
                    },
                  },
                }}
              />
            </div>
            <div
              className={`${styles.fieldWrapper} ${styles.fieldWrapper__twoInputs}`}
            >
              <div className={styles.cardElementsBox}>
                <div className={styles.expBox}>
                  <label htmlFor="expDate">Datum isteka</label>
                  <CardExpiryElement
                    id="expDate"
                    className={styles.input}
                    options={{
                      placeholder: "Vrijedi do",
                      style: { base: { color: textColor } },
                    }}
                  />
                </div>
                <div className={styles.cvcBox}>
                  <label htmlFor="CVC">CVC</label>
                  <CardCvcElement
                    id="CVC"
                    className={styles.input}
                    options={{
                      placeholder: "Sigurnosni kod",
                      style: { base: { color: textColor } },
                    }}
                  />
                </div>
              </div>
            </div>
            {extraContent}
          </div>
        </div>
        <div>
          <Button className={styles.btn}>{btnText}</Button>
        </div>
      </form>
    </>
  );
};

export default PaymentForm;
