import React, { useEffect, useState } from "react";
import { URL } from "../../../constants/config/url";
import { OrdersState } from "../../../constants/types/orderState.types";
import useFetch from "../../../hooks/useFetch";
import Button from "../../Common/Buttons/Button/Button";
import ErrorSection from "../DashboardCommon/ErrorSection";
import LoadingSection from "../DashboardCommon/LoadingSection";
import { ToastContainer, toast } from "react-toastify";
import { DateRange } from "react-day-picker";

import styles from "./History.module.css";
import HistoryItem from "./HistoryItem/HistoryItem";
import DatePicker from "../../Common/DatePicker/DatePicker";
import { convertToISODate } from "../../../helpers/general/convertToISODate";

type Props = {};

const History = (props: Props) => {
  const [orderUrl, setOrderUrl] = useState(`${URL}/order/confirmed?`);
  const [selectedRange, setselectedRange] = useState<DateRange | undefined>(
    undefined
  );

  const { state: ordersState, doFetch } = useFetch<{ response: OrdersState }>(
    orderUrl
  );

  const [orderHistory, setOrderHistory] = useState<OrdersState>({
    orders: [],
    hasMore: false,
  });

  const loadMore = async () => {
    const loadOrdersResponse = await fetch(
      `${orderUrl}&skip=${orderHistory.orders.length}&take=10`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!loadOrdersResponse.ok)
      return toast.error("Nismo uspjeli učitati više narudžbi", {
        style: {
          backgroundColor: "var(--white)",
          color: "var(--black)",
          fontSize: "1.4rem",
        },
      });

    const { response } = (await loadOrdersResponse.json()) as {
      response: OrdersState;
    };

    setOrderHistory((prev) => ({
      orders: prev.orders.concat(response.orders),
      hasMore: response.hasMore,
    }));
  };

  useEffect(() => {
    doFetch(
      { method: "GET", credentials: "include" },
      `${orderUrl}&skip=0&take=10`
    );
  }, [doFetch, orderUrl]);

  useEffect(() => {
    if (!ordersState.data) return;
    console.log(ordersState.data);
    setOrderHistory(ordersState.data.response);
  }, [ordersState.data]);

  if (ordersState.error)
    return (
      <ErrorSection
        handleFormReload={() =>
          doFetch(
            { method: "GET", credentials: "include" },
            `${orderUrl}&skip=0&take=10`
          )
        }
      />
    );

  if (ordersState.isLoading) return <LoadingSection />;

  if (ordersState.data)
    return (
      <div className={styles.mainBox}>
        <ToastContainer
          autoClose={2500}
          pauseOnHover={false}
          pauseOnFocusLoss={false}
          limit={6}
          enableMultiContainer={true}
        />
        <div className={styles.contentBox}>
          <div className={styles.titleBox}>
            <h2 className={styles.title}>Povijest Narudžbi</h2>
            <DatePicker
              selectedRange={selectedRange}
              setSelectedRange={setselectedRange}
              onSearch={() => {
                setOrderUrl(
                  `${URL}/order/confirmed?${
                    selectedRange?.from
                      ? `after=${convertToISODate(selectedRange.from)}&before=${
                          selectedRange.to
                            ? convertToISODate(selectedRange.to)
                            : convertToISODate(selectedRange.from)
                        }`
                      : ""
                  }`
                );
              }}
            />
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Lokacija</th>
                <th>Naručeno</th>
                <th>Status</th>
                <th>Cijena</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {orderHistory.orders.map((order) => (
                <>
                  <tr className={styles.spacer}></tr>
                  <HistoryItem item={order} />
                </>
              ))}
            </tbody>
          </table>
        </div>
        {orderHistory.hasMore && (
          <div className={styles.btnBox}>
            <Button className={styles.btn} onClick={loadMore}>
              Učitajte više
            </Button>
          </div>
        )}
      </div>
    );

  return <LoadingSection />;
};

export default History;
