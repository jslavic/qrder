import React, { useMemo, useState } from "react";
import OrderSummaryButton from "./OrderSummaryButton/OrderSummaryButton";
import { MenuItemType } from "../Menu";

import { ReactComponent as CloseIcon } from "../../../assets/x.svg";

import styles from "./OrderModal.module.css";
import genericStyles from "../MenuModal.module.css";
import { CSSTransition } from "react-transition-group";
import ConfirmOrder from "./ConfirmOrder/ConfirmOrder";
import SelectUser from "./SelectUser/SelectUser";
import PaymentType from "./PaymentType/PaymentType";
import OrderStatus from "./OrderStatus/OrderStatus";
import CardPayment from "./CardPayment/CardPayment";
import OrderTip from "./OrderTip/OrderTip";
import AskTip from "../AskTip/AskTip";

type Props = {
  orderItems: MenuItemType[];
  onAddItem: (item: MenuItemType) => void;
  setModalItem: (id: number) => void;
};

export type OrderStep =
  | "SHOWING_BUTTON"
  | "CONFIRM_ORDER"
  | "SELECT_USER"
  | "SELECT_PAYMENT_TYPE"
  | "ASK_TIP"
  | "LEAVE_TIP"
  | "CARD_PAYMENT"
  | "PAYMENT_INFO"
  | "ORDER_STATUS";

const OrderModal = ({ orderItems, onAddItem, setModalItem }: Props) => {
  const [orderStep, setOrderStep] = useState<OrderStep>("SHOWING_BUTTON");
  const [tip, setTip] = useState("");

  const totalPrice = useMemo(
    () => orderItems.reduce((prev, curr) => prev + curr.fullPrice, 0),
    [orderItems]
  );

  if (orderItems.length === 0 && orderStep !== "SHOWING_BUTTON")
    setOrderStep("SHOWING_BUTTON");

  console.log(tip);
  return orderStep !== "SHOWING_BUTTON" ? (
    <div
      className={genericStyles.modal}
      onClick={() => setOrderStep("SHOWING_BUTTON")}
    >
      <div
        className={genericStyles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseIcon
          className={genericStyles.close}
          onClick={() => setOrderStep("SHOWING_BUTTON")}
        />
        <CSSTransition
          in={orderStep === "CONFIRM_ORDER"}
          timeout={1000}
          mountOnEnter
          unmountOnExit
          classNames={{
            enter: styles.modalContentEnter,
            enterActive: styles.modalContentEnterActive,
            enterDone: styles.modalContentEnterDone,
            exitActive: styles.modalContentExitActive,
            exitDone: styles.modalContentExit,
          }}
        >
          <ConfirmOrder
            totalPrice={totalPrice}
            orderItems={orderItems}
            onAddItem={onAddItem}
            setModalItem={setModalItem}
            setOrderStep={setOrderStep}
          />
        </CSSTransition>
        <CSSTransition
          in={orderStep === "SELECT_USER"}
          timeout={1000}
          mountOnEnter
          unmountOnExit
          classNames={{
            enter: styles.modalContentEnter,
            enterActive: styles.modalContentEnterActive,
            enterDone: styles.modalContentEnterDone,
            exitActive: styles.modalContentExitActive,
            exitDone: styles.modalContentExit,
          }}
        >
          <SelectUser setOrderStep={setOrderStep} />
        </CSSTransition>
        <CSSTransition
          in={orderStep === "SELECT_PAYMENT_TYPE"}
          timeout={1000}
          mountOnEnter
          unmountOnExit
          classNames={{
            enter: styles.modalContentEnter,
            enterActive: styles.modalContentEnterActive,
            enterDone: styles.modalContentEnterDone,
            exitActive: styles.modalContentExitActive,
            exitDone: styles.modalContentExit,
          }}
        >
          <PaymentType setOrderStep={setOrderStep} />
        </CSSTransition>
        <CSSTransition
          in={orderStep === "ASK_TIP"}
          timeout={1000}
          mountOnEnter
          unmountOnExit
          classNames={{
            enter: styles.modalContentEnter,
            enterActive: styles.modalContentEnterActive,
            enterDone: styles.modalContentEnterDone,
            exitActive: styles.modalContentExitActive,
            exitDone: styles.modalContentExit,
          }}
        >
          <AskTip setOrderStep={setOrderStep} setTip={setTip} />
        </CSSTransition>
        <CSSTransition
          in={orderStep === "LEAVE_TIP"}
          timeout={1000}
          mountOnEnter
          unmountOnExit
          classNames={{
            enter: styles.modalContentEnter,
            enterActive: styles.modalContentEnterActive,
            enterDone: styles.modalContentEnterDone,
            exitActive: styles.modalContentExitActive,
            exitDone: styles.modalContentExit,
          }}
        >
          <OrderTip
            totalPrice={totalPrice}
            tip={tip}
            setTip={setTip}
            setOrderStep={setOrderStep}
          />
        </CSSTransition>
        <CSSTransition
          in={orderStep === "CARD_PAYMENT"}
          timeout={1000}
          mountOnEnter
          unmountOnExit
          classNames={{
            enter: styles.modalContentEnter,
            enterActive: styles.modalContentEnterActive,
            enterDone: styles.modalContentEnterDone,
            exitActive: styles.modalContentExitActive,
            exitDone: styles.modalContentExit,
          }}
        >
          <CardPayment
            tip={tip}
            orderItems={orderItems}
            setOrderStep={setOrderStep}
          />
        </CSSTransition>
        <CSSTransition
          in={orderStep === "ORDER_STATUS"}
          timeout={1000}
          mountOnEnter
          unmountOnExit
          classNames={{
            enter: styles.modalContentEnter,
            enterActive: styles.modalContentEnterActive,
            enterDone: styles.modalContentEnterDone,
            exitActive: styles.modalContentExitActive,
            exitDone: styles.modalContentExit,
          }}
        >
          <OrderStatus orderItems={orderItems} />
        </CSSTransition>
      </div>
    </div>
  ) : (
    (orderItems.length > 0 && (
      <OrderSummaryButton
        orderItems={orderItems}
        className={styles.popup}
        onClick={() => setOrderStep("CONFIRM_ORDER")}
        totalPrice={totalPrice}
      />
    )) || <></>
  );
};

export default OrderModal;
