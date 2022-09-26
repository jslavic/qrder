import React, { FormEvent, useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { URL } from "../../../constants/config/url";
import useFetch from "../../../hooks/useFetch";

import styles from "./Withdraw.module.css";
import InputSection from "../../Form/InputSection/InputSection";
import Button from "../../Common/Buttons/Button/Button";
import ErrorSection from "../DashboardCommon/ErrorSection";
import LoadingSection from "../DashboardCommon/LoadingSection";

type BalanceItem = { amount: number; currency: string };

type BalanceData = {
  pending: BalanceItem[];
  available: BalanceItem[];
};

type BalanceState = {
  id: number;
  amount: number;
  currency: string;
  selectedAmount: number;
};

type Props = {};

const getBalanceUrl = `${URL}/payments/balance`;
const postWithdrawUrl = `${URL}/company-authentication/withdraw-funds`;

const Withdraw = (props: Props) => {
  const { state: balanceState, doFetch: fetchBalance } =
    useFetch<BalanceData>(getBalanceUrl);
  const { state: withdrawState, doFetch: fetchWithdraw } =
    useFetch<any>(postWithdrawUrl);

  const [balance, setBalance] = useState<BalanceState[] | null>(null);
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchBalance({
      method: "GET",
      credentials: "include",
    });
  }, [fetchBalance]);

  useEffect(() => {
    if (balanceState.data)
      setBalance(() => {
        const balance: BalanceState[] = [];
        balanceState.data!.available.forEach((item, i) => {
          const pendingBalance =
            balanceState.data!.pending.find(
              (pendingItem) => pendingItem.currency === item.currency
            )?.amount || 0;
          const currentBalance = Math.max(item.amount + pendingBalance, 0);
          currentBalance > 0 &&
            balance.push({
              amount: currentBalance,
              currency: item.currency,
              id: i,
              selectedAmount: currentBalance,
            });
        });
        return balance;
      });
  }, [balanceState.data]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!balance) return;

    console.log(balance[0].amount);

    fetchWithdraw({
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        amount: balance[0].selectedAmount,
        currency: balance[0].currency,
      }),
    });
  };

  useEffect(() => {
    if (withdrawState.data) console.log(withdrawState.data);
  }, [withdrawState]);

  console.log(balance);

  if (balanceState.error)
    return (
      <ErrorSection
        handleFormReload={() =>
          fetchBalance({ method: "GET", credentials: "include" })
        }
      />
    );

  if (balanceState.isLoading) return <LoadingSection />;

  if (balanceState.data)
    return (
      <div>
        <div className={styles.mainBox}>
          <form onSubmit={handleSubmit}>
            <div className={styles.contentBox}>
              <div className={styles.titleBox}>
                <h2 className={styles.title}>
                  Odaberite iznos koji želite podići
                </h2>
              </div>
              <div className={styles.section}>
                <InputSection
                  state={password}
                  label={"Lozinka"}
                  type={"password"}
                  name={"password"}
                  placeholder={"Lozinka vašeg računa"}
                  errorText={"Molimo vas unesite lozinku"}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  onBlur={() => {}}
                />
              </div>
              <div className={styles.section}>
                {balance &&
                  balance.map((item) => (
                    <WithdrawSection
                      key={item.id}
                      item={item}
                      setBalance={setBalance}
                    />
                  ))}
              </div>
              <div className={styles.btnBox}>
                <Button className={styles.btn}>Potvrdite</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );

  return (
    <ErrorSection
      handleFormReload={() =>
        fetchBalance({ method: "GET", credentials: "include" })
      }
    />
  );
};

type WithdrawSectionProps = {
  item: BalanceState;
  setBalance: React.Dispatch<React.SetStateAction<BalanceState[] | null>>;
};

const WithdrawSection = ({
  item: { id, amount, currency, selectedAmount },
  setBalance,
}: WithdrawSectionProps) => {
  return (
    <div className={styles.amountSection}>
      <p className={styles.desc}>
        Odaberite dostupan iznos (u {currency.toUpperCase()})
      </p>
      <div className={styles.selectBox}>
        <input
          type="number"
          name={"amount" + id}
          id={"amount" + id}
          step=".01"
          className={styles.amountInput}
          value={(selectedAmount / 100).toString()}
          max={amount}
          min={0}
          onChange={(e) =>
            setBalance((prev) => {
              const selectedItem = prev!.find((item) => item.id === id);
              if (selectedItem)
                selectedItem.selectedAmount = Math.min(
                  parseFloat(e.target.value) || 0,
                  amount
                );
              return [...prev!];
            })
          }
        />
        <Slider
          className={styles.amountSlider}
          value={selectedAmount}
          max={amount}
          onChange={(value) => {
            console.log(value);
            setBalance((prev) => {
              const newValue = Array.isArray(value) ? value[0] : value;
              const selectedItem = prev!.find((item) => item.id === id);
              if (selectedItem) selectedItem.selectedAmount = newValue;
              return [...prev!];
            });
          }}
          dotStyle={{ display: "none" }}
          marks={{
            0: { label: 0, style: { top: "10px" } },
            [amount]: {
              label: <span>{amount / 100}</span>,
              style: { left: "100%", top: "10px" },
            },
          }}
          trackStyle={{
            backgroundColor: "var(--color-primary-light)",
            height: 12,
          }}
          handleStyle={{
            height: 28,
            width: 28,
            marginLeft: 8,
            marginTop: -8,
            backgroundColor: "var(--color-primary-dark)",
            borderColor: "transparent",
            boxShadow: "0px 0px transparent",
            opacity: 1,
          }}
          railStyle={{ backgroundColor: "var(--white-dark)", height: 12 }}
        />
      </div>
    </div>
  );
};

export default Withdraw;
