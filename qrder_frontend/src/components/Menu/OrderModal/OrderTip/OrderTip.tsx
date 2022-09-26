import React from "react";
import { useSelector } from "react-redux";
import { formatPrice } from "../../../../helpers/general/formatPrice";
import { RootState } from "../../../../store";
import Button from "../../../Common/Buttons/Button/Button";
import { OrderStep } from "../OrderModal";

import styles from "./OrderTip.module.css";

type Props = {
  totalPrice: number;
  tip: string;
  setTip: React.Dispatch<React.SetStateAction<string>>;
  setOrderStep: React.Dispatch<React.SetStateAction<OrderStep>>;
};

const OrderTip = ({ totalPrice, tip, setTip, setOrderStep }: Props) => {
  const { currency } = useSelector((state: RootState) => state.currency);

  return (
    <div className={styles.content}>
      <h3 className={styles.title}>Ostavite napojnicu</h3>
      <div className={styles.inputBox}>
        <div className={styles.tipPercentageBox}>
          {[5, 10, 15, 20, 25].map((percentageAmount) => (
            <div key={percentageAmount}>
              <input
                type="checkbox"
                name={`${percentageAmount} discount`}
                id={`${percentageAmount} discount`}
                value={percentageAmount}
                checked={
                  tip ===
                  "" + (totalPrice * (percentageAmount / 100)).toFixed(2)
                }
                onChange={() =>
                  tip ===
                  "" + (totalPrice * (percentageAmount / 100)).toFixed(2)
                    ? setTip("")
                    : setTip(
                        "" + (totalPrice * (percentageAmount / 100)).toFixed(2)
                      )
                }
              />
              <label htmlFor={`${percentageAmount} discount`}>
                <div
                  className={styles.percentageText}
                >{`${percentageAmount}%`}</div>
                <div className={styles.percentageToPriceText}>
                  {formatPrice(totalPrice * (percentageAmount / 100))}
                  {currency}
                </div>
              </label>
            </div>
          ))}
        </div>
        <div className={styles.divider}>
          <div className={styles.dividerText}>ILI</div>
        </div>
        <div className={styles.customAmountBox}>
          <p className={styles.customAmountText}>
            Sami odredite napojnicu <i>({currency})</i> :
          </p>
          <input
            type="number"
            id="tip"
            className={styles.input}
            placeholder="Opcionalno"
            value={tip}
            onChange={(e) => setTip(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.actionsBox}>
        <div>
          <p className={styles.finalPrice}>
            Konačna cijena:
            <span className={styles.price}>
              {formatPrice(totalPrice + (+tip || 0))}
              {currency}
            </span>
          </p>
          <div className={styles.btnBox}>
            <Button
              className={`${styles.btn} ${styles.btn__red}`}
              onClick={() => {
                setTip("0");
                setOrderStep("CARD_PAYMENT");
              }}
            >
              Preskočite napojnicu
            </Button>
            <Button
              className={`${styles.btn} ${styles.btn__green}`}
              onClick={() => setOrderStep("CARD_PAYMENT")}
            >
              Dodajte napojnicu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTip;
