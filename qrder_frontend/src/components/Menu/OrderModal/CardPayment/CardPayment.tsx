import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  loadStripe,
  PaymentIntent,
  PaymentMethod,
  Stripe,
} from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../../../hooks/useFetch";
import LoadingSpinner from "../../../Common/LoadingSpinner/LoadingSpinner";
import { OrderStep } from "../OrderModal";

import { ReactComponent as ErrorIcon } from "../../../../assets/x-circle.svg";
import { ReactComponent as RetryIcon } from "../../../../assets/retry.svg";

import styles from "./CardPayment.module.css";
import Button from "../../../Common/Buttons/Button/Button";
import { MenuItemType } from "../../Menu";
import { URL } from "../../../../constants/config/url";
import { formatPrice } from "../../../../helpers/general/formatPrice";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

type CardPaymentProps = {
  tip: string;
  orderItems: MenuItemType[];
  setOrderStep: React.Dispatch<React.SetStateAction<OrderStep>>;
};

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

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

const CardPayment = ({ tip, orderItems }: CardPaymentProps) => {
  const { qrData } = useParams();
  const orderUrl = `${URL}/order/price/${qrData}`;
  const confirmOrderUrl = `${URL}/order/pay/${qrData}`;
  const { state: paymentIntentState, doFetch: fetchPaymentIntent } =
    useFetch<PaymentIntent>(orderUrl);

  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    fetchPaymentIntent({
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productIds: orderItems,
        tip: +tip || undefined,
      }),
    });
  }, [fetchPaymentIntent, tip, orderItems]);

  useEffect(() => {
    if (paymentIntentState.data) setPrice(paymentIntentState.data.amount / 100);
    console.log(paymentIntentState.data);
  }, [paymentIntentState.data, paymentIntentState.error]);

  const handleFormReload = () => {
    fetchPaymentIntent();
  };

  const handleSubmit = async (
    paymentMethod: PaymentMethod,
    stripe: Stripe,
    setPaymentError: React.Dispatch<boolean>
  ) => {
    const paymentResponse = await fetch(confirmOrderUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentIntentId: paymentIntentState.data!.id,
        paymentMethodId: paymentMethod!.id,
        order: {
          productIds: orderItems,
          tip: +tip || undefined,
        },
      }),
    });
    if (!paymentResponse.ok) return setPaymentError(true);

    const paymentIntent = (await paymentResponse.json()) as PaymentIntent;

    if (paymentIntent.status !== "succeeded")
      return stripe.confirmCardPayment(paymentIntentState.data!.client_secret!);
  };

  return (
    <div className={styles.content}>
      {(!paymentIntentState || paymentIntentState.isLoading) && (
        <div className={styles.centered}>
          <LoadingSpinner size={60} />
          <p className={styles.text}>Učitavamo vašu narudžbu...</p>
        </div>
      )}
      {paymentIntentState.error && (
        <div className={styles.centered}>
          <ErrorIcon className={styles.icon} />
          <p className={styles.textError}>
            Nismo uspjeli učitati vašu narudžbu
          </p>
          <Button
            className={`${styles.btn} ${styles.btn__error}`}
            onClick={handleFormReload}
          >
            <RetryIcon className={styles.retryIcon} />
            Pokušajte ponovo
          </Button>
        </div>
      )}
      {price && paymentIntentState.data && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: paymentIntentState.data.client_secret || undefined,
          }}
        >
          <PaymentForm
            price={price}
            onFormReload={handleFormReload}
            onSubmit={handleSubmit}
          />
        </Elements>
      )}
    </div>
  );
};

type PaymentFormProps = {
  price: number;
  onFormReload: () => void;
  onSubmit: (
    paymentMethod: PaymentMethod,
    stripe: Stripe,
    setPaymentError: React.Dispatch<boolean>
  ) => void;
};

const PaymentForm = ({ price, onFormReload, onSubmit }: PaymentFormProps) => {
  const { currency } = useSelector((state: RootState) => state.currency);

  const stripe = useStripe();
  const elements = useElements();

  const [paymentError, setPaymentError] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const handleFormRelaod = () => {
    setLoadingPayment(false);
    setPaymentError(false);
    onFormReload();
  };

  const handleSubmit = async () => {
    if (!stripe || !elements) return setPaymentError(true);

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) return setPaymentError(true);

    const { paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
    });

    setLoadingPayment(true);
    onSubmit(paymentMethod!, stripe, setPaymentError);
    setLoadingPayment(false);
  };
  return (
    <>
      {loadingPayment && !paymentError && (
        <div className={styles.centered}>
          <LoadingSpinner size={60} />
          <p className={styles.text}>Procesiramo vašu narudžbu...</p>
        </div>
      )}
      {paymentError && (
        <div className={styles.centered}>
          <ErrorIcon className={styles.icon} />
          <p className={styles.textError}>
            Nismo uspjeli procesirati vašu narudžbu
          </p>
          <Button
            className={`${styles.btn} ${styles.btn__error}`}
            onClick={handleFormRelaod}
          >
            <RetryIcon className={styles.retryIcon} />
            Pokušajte ponovo
          </Button>
        </div>
      )}
      <div
        className={styles.paymentBox}
        style={paymentError || loadingPayment ? { visibility: "hidden" } : {}}
      >
        <div>
          <h3 className={styles.title}>Plaćanje karticom</h3>
        </div>
        <div className={styles.formInputBox}>
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
            <div className={styles.cardElementsBox}>
              <div className={styles.expBox}>
                <label htmlFor="expDate">Datum isteka</label>
                <CardExpiryElement id="expDate" className={styles.input} />
              </div>
              <div className={styles.cvcBox}>
                <label htmlFor="CVC">CVC</label>
                <CardCvcElement id="CVC" className={styles.input} />
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className={styles.finalPrice}>
            Konačna cijena:
            <span className={styles.price}>
              {formatPrice(price!)}
              {currency}
            </span>
          </p>
          <Button className={styles.btn} onClick={handleSubmit}>
            Potvrdite narudžbu
          </Button>
        </div>
      </div>
    </>
  );
};

export default CardPayment;
