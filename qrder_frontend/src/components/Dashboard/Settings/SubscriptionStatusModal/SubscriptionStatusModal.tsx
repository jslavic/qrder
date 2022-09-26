import React, { useEffect } from "react";
import { URL } from "../../../../constants/config/url";
import useFetch from "../../../../hooks/useFetch";
import Button from "../../../Common/Buttons/Button/Button";
import BaseModal from "../../../Common/BaseModal/BaseModal";

import styles from "./SubscriptionStatusModal.module.css";
import { SubscriptionData } from "../Settings";

type Props = {
  isActive: boolean;
  subscriptionPlan: string;
  setSubscriptionData: React.Dispatch<
    React.SetStateAction<SubscriptionData | null>
  >;
  closeModal: () => void;
};

const SubscriptionStatusModal = ({
  isActive,
  subscriptionPlan,
  setSubscriptionData,
  closeModal,
}: Props) => {
  const subscriptionUrl = isActive
    ? `${URL}/subscription/cancel`
    : `${URL}/subscription/resume`;

  const { state: fetchState, doFetch } = useFetch<any>(subscriptionUrl);

  const handleSubmit = async () => {
    doFetch({
      method: "PATCH",
      credentials: "include",
    });
  };

  useEffect(() => {
    if (!fetchState.data) return;
    setSubscriptionData((prev) =>
      prev ? { ...prev, cancel_at_period_end: isActive } : null
    );
    closeModal();
  }, [fetchState.data, setSubscriptionData, closeModal, isActive]);

  return (
    <BaseModal small className={styles.content} closeModal={closeModal}>
      <h2 className={styles.title}>
        Jeste li sigurni da želite {isActive ? "otkazati" : "nastaviti"} vašu{" "}
        <span className={styles.highlighted}>
          {subscriptionPlan.toLowerCase()}
        </span>{" "}
        pretplatu?
      </h2>
      <div className={styles.buttons}>
        <Button className={styles.btn__cancel} onClick={closeModal}>
          Natrag
        </Button>
        <Button
          className={
            isActive
              ? styles.btn__confirmCancelation
              : styles.btn__confirmContinue
          }
          onClick={handleSubmit}
        >
          {isActive ? "Otkaži" : "Nastavi"}
        </Button>
      </div>
    </BaseModal>
  );
};

export default SubscriptionStatusModal;
