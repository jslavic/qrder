import React, { useEffect } from "react";
import { URL } from "../../../../constants/config/url";
import useFetch from "../../../../hooks/useFetch";
import LoadingSpinner from "../../../Common/LoadingSpinner/LoadingSpinner";
import { MenuItemType } from "../../Menu";

import { ReactComponent as CheckmarkIcon } from "../../../../assets/check-circle.svg";
import { ReactComponent as ErrorIcon } from "../../../../assets/x-circle.svg";
import { ReactComponent as RetryIcon } from "../../../../assets/retry.svg";

import styles from "./OrderStatus.module.css";
import Button from "../../../Common/Buttons/Button/Button";
import { useParams } from "react-router-dom";

type Props = {
  orderItems: MenuItemType[];
};

const OrderStatus = ({ orderItems }: Props) => {
  const { qrData } = useParams();
  const orderUrl = `${URL}/order/${qrData}`;
  const { state, doFetch } = useFetch<any>(orderUrl);

  useEffect(() => {
    doFetch({
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderType: "CASH",
        productIds: orderItems,
      }),
    });
  }, [doFetch, orderItems]);

  console.log(state.data);

  return (
    <div className={styles.contentBox}>
      {(!state || state.isLoading) && (
        <>
          <LoadingSpinner size={60} />
          <p className={styles.text}>Procesiramo vašu narudžbu...</p>
        </>
      )}
      {state.error && (
        <>
          <ErrorIcon className={styles.icon} />
          <p className={styles.text_error}>
            Nismo uspjeli procesirati vašu narudžbu
          </p>
          <Button className={styles.btn}>
            <RetryIcon className={styles.retryIcon} />
            Pokušajte ponovo
          </Button>
        </>
      )}
      {state.data && (
        <>
          <CheckmarkIcon className={styles.icon} />
          <p>Vaša narudžba je uspješno primljena</p>
        </>
      )}
    </div>
  );
};

export default OrderStatus;
