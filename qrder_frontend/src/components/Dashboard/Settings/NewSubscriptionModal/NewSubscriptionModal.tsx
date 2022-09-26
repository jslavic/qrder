import { Stripe, StripeCardNumberElement } from "@stripe/stripe-js";
import React, { useState } from "react";
import { URL } from "../../../../constants/config/url";
import { PreselectedPlans } from "../../../../constants/enums/auth.enums";
import BaseModal from "../../../Common/BaseModal/BaseModal";
import PaymentForm from "../../../Common/PaymentForm/PaymentForm";
import InputSection from "../../../Form/InputSection/InputSection";
import { CardData } from "../Settings";

import styles from "./NewSubscriptionModal.module.css";

type Props = {
  closeModal: () => void;
  setCardData: React.Dispatch<React.SetStateAction<CardData | null>>;
};

const setupIntentUrl = `${URL}/payments/setup-intent/v2`;
const newSubscriptionUrl = `${URL}/subscription/create/v2`;

const NewSubscriptionModal = ({ setCardData, closeModal }: Props) => {
  const [selectedPlan, setSelectedPlan] = useState(PreselectedPlans.STANDARD);

  const handleSubmit = async (
    cardNumberElement: StripeCardNumberElement,
    stripe: Stripe,
    setPaymentError: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (
      selectedPlan !== PreselectedPlans.STANDARD &&
      selectedPlan !== PreselectedPlans.PREMIUM
    )
      return console.log("ERROR");

    const paymentResponse = await fetch(setupIntentUrl, {
      method: "POST",
      credentials: "include",
    });
    if (!paymentResponse.ok) return setPaymentError(true);

    const setupIntent = (await paymentResponse.json()) as {
      id: string;
      client_secret: string;
    };

    const { setupIntent: confirmedSetupIntent, error: setupError } =
      await stripe.confirmCardSetup(setupIntent.client_secret, {
        payment_method: { card: cardNumberElement },
      });

    if (setupError) return setPaymentError(true);

    console.log(confirmedSetupIntent);

    const newSubscriptionResponse = await fetch(newSubscriptionUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentMethodId: confirmedSetupIntent.payment_method,
        priceLookupKey: selectedPlan,
      }),
    });
    console.log(newSubscriptionResponse);
    if (!newSubscriptionResponse.ok) return setPaymentError(true);

    const resposne = await newSubscriptionResponse.json();
    console.log(resposne);

    // const { paymentMethod, error } = await stripe.createPaymentMethod({
    //   type: "card",
    //   card: cardNumberElement,
    // });
    // if (!paymentMethod || error) return;

    // const paymentResponse = await fetch(setupIntentUrl, {
    //   method: "POST",
    //   credentials: "include",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     paymentMethodId: paymentMethod.id,
    //   }),
    // });
    // console.log(paymentResponse.body);
    // if (!paymentResponse.ok) return setPaymentError(true);

    // const setupIntent = (await paymentResponse.json()) as {
    //   id: string;
    //   client_secret: string;
    // };

    // const { setupIntent: confirmedSetupIntent, error: setupError } =
    //   await stripe.confirmCardSetup(setupIntent.client_secret);

    // if (setupError) return setPaymentError(true);

    // const newSubscriptionResponse = await fetch(newSubscriptionUrl, {
    //   method: "POST",
    //   credentials: "include",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     setupIntentId: confirmedSetupIntent.id,
    //     priceLookupKey: selectedPlan,
    //   }),
    // });
    // console.log(newSubscriptionResponse);
    // if (!newSubscriptionResponse.ok) return setPaymentError(true);

    // const resposne = await newSubscriptionResponse.json();
    // console.log(resposne);

    // ------------------

    // const changeMethodResponse = await fetch(newSubscriptionUrl, {
    //   method: "PATCH",
    //   credentials: "include",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     setupIntentId: confirmedSetupIntent.id,
    //   }),
    // });
    // if (!changeMethodResponse.ok) return setPaymentError(true);

    // const newCardData = (await changeMethodResponse.json()) as CardData;

    // setCardData({
    //   brand: newCardData.brand,
    //   exp_month: newCardData.exp_month,
    //   exp_year: newCardData.exp_year,
    //   last4: newCardData.last4,
    // });
    // closeModal();
  };

  return (
    <BaseModal closeModal={closeModal} className={styles.modalContent}>
      <PaymentForm
        title="Započnite novu pretplatu"
        btnText="Potvrdite"
        loadingText="Potvrđujemo novu pretplatu..."
        errorText="Nismo uspjeli potvrditi vašu novu pretplatu"
        onSubmit={handleSubmit}
        extraContent={
          <InputSection
            state={selectedPlan}
            label={"Izaberite plan"}
            type={"select"}
            name={"plan"}
            placeholder={""}
            errorText={"Odaberite plan vaš plan mjesečne pretplate"}
            onChange={(e) =>
              setSelectedPlan(e.target.value as PreselectedPlans)
            }
            onBlur={() => {}}
          >
            <option value="" disabled>
              Odaberite plan pretplate
            </option>
            <option value={PreselectedPlans.STANDARD}>Standard</option>
            <option value={PreselectedPlans.PREMIUM}>Premium</option>
          </InputSection>
        }
      />
    </BaseModal>
  );
};

export default NewSubscriptionModal;
