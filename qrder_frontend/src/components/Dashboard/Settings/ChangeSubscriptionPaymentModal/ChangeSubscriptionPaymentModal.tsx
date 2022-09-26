// import {
//   CardCvcElement,
//   CardExpiryElement,
//   CardNumberElement,
//   Elements,
//   useElements,
//   useStripe,
// } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import React, { FormEvent, useState } from "react";
// import { URL } from "../../../../constants/config/url";
// import BaseModal from "../../../Common/BaseModal/BaseModal";
// import Button from "../../../Common/Buttons/Button/Button";
// import { CardData } from "../Settings";

// import { ReactComponent as ErrorIcon } from "../../../../assets/x-circle.svg";
// import { ReactComponent as RetryIcon } from "../../../../assets/retry.svg";

// import styles from "./ChangeSubscriptionPaymentModal.module.css";
// import LoadingSpinner from "../../../Common/LoadingSpinner/LoadingSpinner";

// type Props = {
//   closeModal: () => void;
//   setCardData: React.Dispatch<React.SetStateAction<CardData | null>>;
// };

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

// const ChangeSubscriptionPaymentModal = ({ closeModal, setCardData }: Props) => {
//   return (
//     <BaseModal closeModal={closeModal} className={styles.modalContent}>
//       <Elements stripe={stripePromise}>
//         <CardForm closeModal={closeModal} setCardData={setCardData} />
//       </Elements>
//     </BaseModal>
//   );
// };

// type CardFormProps = {
//   closeModal: () => void;
//   setCardData: React.Dispatch<React.SetStateAction<CardData | null>>;
// };

// const cardNumberStyling = {
//   showIcon: true,
//   placeholder: "Broj kartice",
// };

// const textColor = "#1a1a1a";

// const setupIntentUrl = `${URL}/payments/setup-intent`;
// const changeSubscriptionPaymentUrl = `${URL}/subscription/payment`;

// const CardForm = ({ closeModal, setCardData }: CardFormProps) => {
//   const [paymentError, setPaymentError] = useState(false);
//   const [paymentLoading, setPaymentLoading] = useState(false);

//   const stripe = useStripe();
//   const elements = useElements();

//   const isLoaded = !!(stripe && elements);

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!stripe || !elements) return setPaymentError(true);

//     const cardNumberElement = elements.getElement(CardNumberElement);

//     if (!cardNumberElement) return setPaymentError(true);

//     const { paymentMethod, error } = await stripe.createPaymentMethod({
//       type: "card",
//       card: cardNumberElement,
//     });
//     if (!paymentMethod || error) return;

//     const paymentResponse = await fetch(setupIntentUrl, {
//       method: "POST",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         paymentMethodId: paymentMethod.id,
//       }),
//     });
//     console.log(paymentResponse.body);
//     if (!paymentResponse.ok) return setPaymentError(true);

//     const setupIntent = (await paymentResponse.json()) as {
//       id: string;
//       client_secret: string;
//     };

//     const { setupIntent: confirmedSetupIntent, error: setupError } =
//       await stripe.confirmCardSetup(setupIntent.client_secret);

//     if (setupError) return setPaymentError(true);

//     const changeMethodResponse = await fetch(changeSubscriptionPaymentUrl, {
//       method: "PATCH",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         setupIntentId: confirmedSetupIntent.id,
//       }),
//     });
//     if (!changeMethodResponse.ok) return setPaymentError(true);

//     const newCardData = (await changeMethodResponse.json()) as CardData;

//     setCardData({
//       brand: newCardData.brand,
//       exp_month: newCardData.exp_month,
//       exp_year: newCardData.exp_year,
//       last4: newCardData.last4,
//     });
//     closeModal();
//   };

//   const handleFormReload = () => {
//     setPaymentError(false);
//     setPaymentLoading(false);
//   };

//   return (
//     <>
//       {!isLoaded && (
//         <div className={styles.centered}>
//           <LoadingSpinner size={60} />
//           <p className={styles.text}>Učitavanje...</p>
//         </div>
//       )}
//       {paymentLoading && !paymentError && (
//         <div className={styles.centered}>
//           <LoadingSpinner size={60} />
//           <p className={styles.text}>Potvrđujemo karticu...</p>
//         </div>
//       )}
//       {paymentError && (
//         <div className={styles.centered}>
//           <ErrorIcon className={styles.icon} />
//           <p className={styles.textError}>
//             Nismo uspjeli potvrditi vašu karticu
//           </p>
//           <Button
//             className={`${styles.btn} ${styles.btn__error}`}
//             onClick={handleFormReload}
//           >
//             <RetryIcon className={styles.retryIcon} />
//             Pokušajte ponovo
//           </Button>
//         </div>
//       )}
//       <form
//         onSubmit={async (e) => {
//           setPaymentLoading(true);
//           await handleSubmit(e);
//           setPaymentLoading(false);
//         }}
//         className={styles.formContent}
//         style={
//           paymentError || paymentLoading || !isLoaded
//             ? { visibility: "hidden" }
//             : {}
//         }
//       >
//         <div className={styles.titleBox}>
//           <h2 className={styles.title}>Promijenite podatke za plaćanje</h2>
//           <p className={styles.desc}>
//             Kartica koju unesete biti će primijenjena za sva buduća plaćanja
//             tijekom vaše preplate
//           </p>
//         </div>
//         <div className={styles.formContent}>
//           <div className={styles.formInputBox}>
//             <div className={styles.fieldWrapper}>
//               <label htmlFor="number">Broj kartice</label>
//               <CardNumberElement
//                 id="number"
//                 className={styles.input}
//                 options={{
//                   ...cardNumberStyling,
//                   style: {
//                     base: {
//                       fontSize: "15px",
//                       iconColor: "#7f5eff",
//                       color: textColor,
//                     },
//                   },
//                 }}
//               />
//             </div>
//             <div
//               className={`${styles.fieldWrapper} ${styles.fieldWrapper__twoInputs}`}
//             >
//               <div className={styles.cardElementsBox}>
//                 <div className={styles.expBox}>
//                   <label htmlFor="expDate">Datum isteka</label>
//                   <CardExpiryElement
//                     id="expDate"
//                     className={styles.input}
//                     options={{
//                       placeholder: "Vrijedi do",
//                       style: { base: { color: textColor } },
//                     }}
//                   />
//                 </div>
//                 <div className={styles.cvcBox}>
//                   <label htmlFor="CVC">CVC</label>
//                   <CardCvcElement
//                     id="CVC"
//                     className={styles.input}
//                     options={{
//                       placeholder: "Sigurnosni kod",
//                       style: { base: { color: textColor } },
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div>
//           <Button className={styles.btn}>
//             Promijenite podatke za plaćanje
//           </Button>
//         </div>
//       </form>
//     </>
//   );
// };

// export default ChangeSubscriptionPaymentModal;

import { Stripe, StripeCardNumberElement } from "@stripe/stripe-js";
import React from "react";
import { URL } from "../../../../constants/config/url";
import BaseModal from "../../../Common/BaseModal/BaseModal";
import PaymentForm from "../../../Common/PaymentForm/PaymentForm";
import { CardData } from "../Settings";

import styles from "./ChangeSubscriptionPaymentModal.module.css";

type Props = {
  closeModal: () => void;
  setCardData: React.Dispatch<React.SetStateAction<CardData | null>>;
};

const setupIntentUrl = `${URL}/payments/setup-intent`;
const changeSubscriptionPaymentUrl = `${URL}/subscription/payment`;

const ChangeSubscriptionPaymentModal = ({ setCardData, closeModal }: Props) => {
  const handleSubmit = async (
    cardNumberElement: StripeCardNumberElement,
    stripe: Stripe,
    setPaymentError: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
    });
    if (!paymentMethod || error) return;

    const paymentResponse = await fetch(setupIntentUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentMethodId: paymentMethod.id,
      }),
    });
    console.log(paymentResponse.body);
    if (!paymentResponse.ok) return setPaymentError(true);

    const setupIntent = (await paymentResponse.json()) as {
      id: string;
      client_secret: string;
    };

    const { setupIntent: confirmedSetupIntent, error: setupError } =
      await stripe.confirmCardSetup(setupIntent.client_secret);

    if (setupError) return setPaymentError(true);

    const changeMethodResponse = await fetch(changeSubscriptionPaymentUrl, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        setupIntentId: confirmedSetupIntent.id,
      }),
    });
    if (!changeMethodResponse.ok) return setPaymentError(true);

    const newCardData = (await changeMethodResponse.json()) as CardData;

    setCardData({
      brand: newCardData.brand,
      exp_month: newCardData.exp_month,
      exp_year: newCardData.exp_year,
      last4: newCardData.last4,
    });
    closeModal();
  };

  return (
    <BaseModal closeModal={closeModal} className={styles.modalContent}>
      <PaymentForm
        title="Promijenite podatke za plaćanje"
        desc="Kartica koju unesete biti će primijenjena za sva buduća plaćanja tijekom vaše preplate"
        btnText="Promijenite podatke za plaćanje"
        loadingText="Potvrđujemo karticu..."
        errorText="Nismo uspjeli potvrditi vašu karticu"
        onSubmit={handleSubmit}
      />
    </BaseModal>
  );
};

export default ChangeSubscriptionPaymentModal;
