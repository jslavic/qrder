import React, { ChangeEvent, useEffect, useReducer } from "react";
import validator from "validator";
import { DiscountDto } from "../../../../../constants/dto/items/discount.dto";
import Button from "../../../../Common/Buttons/Button/Button";
import InputSection from "../../../../Form/InputSection/InputSection";
import BaseModal from "../../../../Common/BaseModal/BaseModal";
import ModalProductItem from "../ModalProductItem/ModalProductItem";
import {
  formReducer,
  State as StateInterface,
  ActionGeneric,
} from "../../../../../reducers/formReucer";
import { StatePropertyValue } from "../../../../../constants/types/form.types";
import { RepeatedDiscount } from "../../../../../constants/enums/discountEnums/repeatedDiscount";
import { RepeatedDays } from "../../../../../constants/enums/discountEnums/repeatedDays.enum";
import { getOnChangeHandler } from "../../../../../helpers/form/getOnChangeHandler.helper";
import { getOnBlurHandler } from "../../../../../helpers/form/getOnBlurHandler.helper";
import { toTitleCase } from "../../../../../helpers/general/toTitleCase";
import { getRepeatedDayFromNumber } from "../../../../../helpers/discount/getRepeatedDayFromNumber";
import { URL } from "../../../../../constants/config/url";
import useFetch from "../../../../../hooks/useFetch";
import { setDay } from "../../../../../helpers/discount/setDay";

import styles from "./DiscountModal.module.css";
import { ProductDto } from "../../../../../constants/dto/items/product.dto";

type Props = {
  discount?: DiscountDto;
  products: ProductDto[];
  setProducts: React.Dispatch<React.SetStateAction<ProductDto[]>>;
  modifyDiscount: (item: DiscountDto) => void;
  closeModal: () => void;
};

interface State extends StateInterface {
  name: StatePropertyValue<string>;
  amount: StatePropertyValue<string>;
  type: StatePropertyValue<"PERCENTAGE" | "AMOUNT">;
  repeated: StatePropertyValue<RepeatedDiscount>;
  fromMin: StatePropertyValue<string>;
  fromH: StatePropertyValue<string>;
  fromDayInWeek: StatePropertyValue<number>;
  fromDateDay: StatePropertyValue<string>;
  fromMonth: StatePropertyValue<string>;
  fromYear: StatePropertyValue<string>;
  toMin: StatePropertyValue<string>;
  toH: StatePropertyValue<string>;
  toDayInWeek: StatePropertyValue<number>;
  toDateDay: StatePropertyValue<string>;
  toMonth: StatePropertyValue<string>;
  toYear: StatePropertyValue<string>;
  repeatedDays: StatePropertyValue<RepeatedDays[]>;
  productIds: StatePropertyValue<number[]>;
}

type FormFields =
  | "name"
  | "amount"
  | "type"
  | "repeated"
  | "fromMin"
  | "fromH"
  | "fromDayInWeek"
  | "fromDateDay"
  | "fromMonth"
  | "fromYear"
  | "toMin"
  | "toH"
  | "toDayInWeek"
  | "toDateDay"
  | "toMonth"
  | "toYear"
  | "repeatedDays"
  | "productIds";

const getInitialState = (initialState?: DiscountDto) => {
  const initialFromDate = initialState
    ? new Date(initialState.from)
    : undefined;
  const initialToDate = initialState ? new Date(initialState.to) : undefined;
  return {
    name: {
      value: initialState?.name || "",
      isTouched: false,
      isValid: initialState ? true : false,
      validator: (value) => {
        return validator.isLength(value.trim(), { min: 1 });
      },
    },
    amount: {
      value: initialState?.amount.toString() || "",
      isTouched: false,
      isValid: initialState ? true : false,
      validator: (value: string, state: State) => {
        console.log(state.type.value);
        if (validator.isFloat(value, { gt: 0 })) {
          if (state.type.value === "PERCENTAGE")
            return validator.isFloat(value, { max: 100 });
          return true;
        }
        return false;
      },
    },
    type: {
      value: initialState?.type || "PERCENTAGE",
      isTouched: false,
      isValid: true,
      validator: (value) => {
        return value === "PERCENTAGE" || value === "AMOUNT";
      },
    },
    repeated: {
      value: initialState?.repeated || RepeatedDiscount.NOT_REPEATED,
      isTouched: false,
      isValid: true,
      validator: (value) => {
        return Object.values(RepeatedDiscount).includes(
          value as RepeatedDiscount
        );
      },
    },
    fromMin: {
      value: initialFromDate?.getUTCMinutes().toString() || "",
      isTouched: false,
      isValid: initialState ? true : false,
      validator: (value) => {
        return validator.isInt(value, { min: 0, max: 59 });
      },
    },
    fromH: {
      value: initialFromDate?.getUTCHours().toString() || "",
      isTouched: false,
      isValid: initialState ? true : false,
      validator: (value) => {
        return validator.isInt(value, { min: 0, max: 23 });
      },
    },
    fromDayInWeek: {
      value: initialFromDate?.getUTCDay() || 1,
      isTouched: false,
      isValid: true,
      validator: (value) => {
        return validator.isInt(value.toString(), { min: 0, max: 6 });
      },
    },
    fromDateDay: {
      value:
        ((initialState?.repeated === RepeatedDiscount.MONTHLY ||
          initialState?.repeated === RepeatedDiscount.NOT_REPEATED) &&
          initialFromDate?.getUTCDate().toString()) ||
        "",
      isTouched: false,
      isValid:
        initialState?.repeated === RepeatedDiscount.MONTHLY ||
        initialState?.repeated === RepeatedDiscount.NOT_REPEATED
          ? true
          : false,
      validator: (value: string, state: State) => {
        if (
          state.repeated.value === RepeatedDiscount.MONTHLY ||
          state.repeated.value === RepeatedDiscount.NOT_REPEATED
        )
          return validator.isInt(value, { min: 1, max: 31 });
        return true;
      },
    },
    fromMonth: {
      value:
        (initialState?.repeated === RepeatedDiscount.NOT_REPEATED &&
          initialFromDate?.getUTCMonth().toString()) ||
        "",
      isTouched: false,
      isValid:
        initialState?.repeated === RepeatedDiscount.NOT_REPEATED ? true : false,
      validator: (value: string, state: State) => {
        if (state.repeated.value === RepeatedDiscount.NOT_REPEATED)
          return validator.isInt(value, { min: 1, max: 12 });
        return true;
      },
    },
    fromYear: {
      value:
        (initialState?.repeated === RepeatedDiscount.NOT_REPEATED &&
          initialFromDate?.getUTCFullYear().toString()) ||
        "",
      isTouched: false,
      isValid:
        initialState?.repeated === RepeatedDiscount.NOT_REPEATED ? true : false,
      validator: (value: string, state: State) => {
        if (state.repeated.value === RepeatedDiscount.NOT_REPEATED)
          return validator.isInt(value, {
            min: new Date().getFullYear(),
          });
        return true;
      },
    },
    toMin: {
      value: initialToDate?.getUTCMinutes().toString() || "",
      isTouched: false,
      isValid: initialState ? true : false,
      validator: (value) => {
        return validator.isInt(value, { min: 0, max: 59 });
      },
    },
    toH: {
      value: initialToDate?.getUTCHours().toString() || "",
      isTouched: false,
      isValid: initialState ? true : false,
      validator: (value) => {
        return validator.isInt(value, { min: 0, max: 23 });
      },
    },
    toDayInWeek: {
      value: initialToDate?.getUTCDay() || 1,
      isTouched: false,
      isValid: true,
      validator: (value) => {
        return validator.isInt(value.toString(), { min: 0, max: 6 });
      },
    },
    toDateDay: {
      value:
        ((initialState?.repeated === RepeatedDiscount.MONTHLY ||
          initialState?.repeated === RepeatedDiscount.NOT_REPEATED) &&
          initialToDate?.getUTCDate().toString()) ||
        "",
      isTouched: false,
      isValid:
        initialState?.repeated === RepeatedDiscount.MONTHLY ||
        initialState?.repeated === RepeatedDiscount.NOT_REPEATED
          ? true
          : false,
      validator: (value: string, state: State) => {
        if (
          state.repeated.value === RepeatedDiscount.MONTHLY ||
          state.repeated.value === RepeatedDiscount.NOT_REPEATED
        )
          return validator.isInt(value, { min: 1, max: 31 });
        return true;
      },
    },
    toMonth: {
      value:
        (initialState?.repeated === RepeatedDiscount.NOT_REPEATED &&
          initialToDate?.getUTCMonth().toString()) ||
        "",
      isTouched: false,
      isValid:
        initialState?.repeated === RepeatedDiscount.NOT_REPEATED ? true : false,
      validator: (value: string, state: State) => {
        if (state.repeated.value === RepeatedDiscount.NOT_REPEATED)
          return validator.isInt(value, { min: 1, max: 12 });
        return true;
      },
    },
    toYear: {
      value:
        (initialState?.repeated === RepeatedDiscount.NOT_REPEATED &&
          initialToDate?.getUTCFullYear().toString()) ||
        "",
      isTouched: false,
      isValid:
        initialState?.repeated === RepeatedDiscount.NOT_REPEATED ? true : false,
      validator: (value: string, state: State) => {
        if (state.repeated.value === RepeatedDiscount.NOT_REPEATED)
          return validator.isInt(value, {
            min: new Date().getFullYear(),
          });
        return true;
      },
    },
    repeatedDays: {
      value:
        (initialState?.repeated === RepeatedDiscount.SPECIFIC_DAYS &&
          initialState.repeatedDays) ||
        ([] as RepeatedDays[]),
      isTouched: false,
      isValid:
        initialState?.repeated === RepeatedDiscount.SPECIFIC_DAYS
          ? true
          : false,
      validator: (value: RepeatedDays[], state: State) => {
        if (state.repeated.value === RepeatedDiscount.SPECIFIC_DAYS)
          return value.reduce((prev, curr) => {
            return (
              prev && Object.values(RepeatedDays).includes(curr as RepeatedDays)
            );
          }, true);
        return true;
      },
    },
    productIds: {
      value:
        (initialState?.productIds && [...initialState.productIds]) ||
        ([] as number[]),
      isTouched: false,
      isValid: true,
      validator: (value) => {
        return value.reduce((prev, curr) => {
          return prev && Number.isInteger(curr);
        }, true);
      },
    },
  } as State;
};

const discountUrl = `${URL}/dashboard/discount`;

const DiscountModal = ({
  discount,
  setProducts,
  modifyDiscount,
  products,
  closeModal,
}: Props) => {
  const [formState, dispatchForm] = useReducer<
    React.Reducer<State, ActionGeneric<FormFields>>
  >(formReducer, getInitialState(discount));
  const { state: fetchState, doFetch } = useFetch<DiscountDto>(discountUrl);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatchForm({ type: "SUBMIT", field: "name" });
    const fromDate = new Date();
    const toDate = new Date();

    fromDate.setUTCHours(+formState.fromH.value, +formState.fromMin.value, 0);
    toDate.setUTCHours(+formState.toH.value, +formState.toMin.value, 0);
    switch (formState.repeated.value) {
      case RepeatedDiscount.WEEKLY:
        fromDate.setUTCDate(setDay(fromDate, formState.fromDayInWeek.value));
        toDate.setUTCDate(setDay(fromDate, formState.toDayInWeek.value, 1));
        break;
      case RepeatedDiscount.MONTHLY:
        fromDate.setUTCDate(+formState.fromDateDay.value);
        toDate.setUTCDate(+formState.toDateDay.value);
        break;
      case RepeatedDiscount.NOT_REPEATED:
        fromDate.setUTCDate(+formState.fromDateDay.value);
        fromDate.setUTCMonth(+formState.fromMonth.value);
        fromDate.setUTCFullYear(+formState.fromYear.value);
        toDate.setUTCDate(+formState.toDateDay.value);
        toDate.setUTCMonth(+formState.toMonth.value);
        toDate.setUTCFullYear(+formState.toYear.value);
        break;
    }
    let repeatedDays: RepeatedDays[] | undefined;
    formState.repeated.value !== RepeatedDiscount.SPECIFIC_DAYS
      ? (repeatedDays = undefined)
      : (repeatedDays = formState.repeatedDays.value);
    const getFetchOptions = (method: "POST" | "PATCH") => ({
      method: method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formState.name.value,
        repeated: formState.repeated.value,
        repeatedDays,
        from: fromDate,
        to: toDate,
        type: formState.type.value,
        amount: +formState.amount.value,
        productIds: formState.productIds.value,
      }),
    });
    discount
      ? doFetch(getFetchOptions("PATCH"), `${discountUrl}/${discount.id}`)
      : doFetch(getFetchOptions("POST"));
  };

  useEffect(() => {
    if (!fetchState.data) return;
    const productIds = fetchState.data.productIds ?? formState.productIds.value;
    modifyDiscount(fetchState.data);
    productIds &&
      setProducts((prev) => {
        return prev.map((product) => {
          if (
            (productIds.includes(product.id) &&
              product.discountIds.includes(fetchState.data!.id)) ||
            (!productIds.includes(product.id) &&
              !product.discountIds.includes(fetchState.data!.id))
          )
            return product;
          if (
            !productIds.includes(product.id) &&
            product.discountIds.includes(fetchState.data!.id)
          ) {
            product.discountIds = product.discountIds.filter(
              (discountId) => discountId !== fetchState.data!.id
            );
            return product;
          }
          if (
            productIds.includes(product.id) &&
            !product.discountIds.includes(fetchState.data!.id)
          ) {
            product.discountIds.push(fetchState.data!.id);
            return product;
          }
          return product;
        });
      });
    closeModal();
  }, [
    fetchState.data,
    formState.productIds.value,
    modifyDiscount,
    closeModal,
    setProducts,
  ]);

  console.log(discount);

  return (
    <form onSubmit={handleSubmit}>
      <BaseModal closeModal={closeModal}>
        <h2 className={styles.title}>Novi Popust</h2>
        <div className={styles.content}>
          <div className={styles.content__main}>
            <div className={styles.formContent}>
              <InputSection
                state={formState.name}
                label={"Ime"}
                type={"text"}
                name={"name"}
                placeholder={"Ime Popusta"}
                errorText={"Ime popusta mora biti definirano"}
                onChange={getOnChangeHandler("name", dispatchForm)}
                onBlur={getOnBlurHandler("name", dispatchForm)}
                inputClassName={styles.input}
              />
              <div className={styles.priceInputBox}>
                <InputSection
                  state={formState.amount}
                  label={"Količina"}
                  type={"number"}
                  name={"amount"}
                  placeholder={"Koliki je popust"}
                  errorText={"Molimo vas unesite validnu količinu popusta"}
                  onChange={getOnChangeHandler("amount", dispatchForm)}
                  onBlur={getOnBlurHandler("amount", dispatchForm)}
                  inputClassName={styles.inputDiscountAmount}
                  divClassName={styles.inputDiscountAmountBox}
                />
                <InputSection
                  state={formState.type}
                  label={"Vrsta"}
                  type={"select"}
                  name={"type"}
                  placeholder={""}
                  onChange={(e) => {
                    dispatchForm({
                      type: "INPUT",
                      field: "type",
                      payload: e.target.value,
                    });
                    dispatchForm({ type: "BLUR", field: "amount" });
                  }}
                  onBlur={getOnBlurHandler("type", dispatchForm)}
                  inputClassName={styles.inputDiscountType}
                  divClassName={styles.inputDiscountTypeBox}
                >
                  <option value="PERCENTAGE">%</option>
                  <option value="AMOUNT">kn</option>
                </InputSection>
              </div>
              <InputSection
                state={formState.repeated}
                label={"Ponavljanje"}
                type={"select"}
                name={"repeated"}
                placeholder={""}
                onChange={getOnChangeHandler("repeated", dispatchForm)}
                onBlur={getOnBlurHandler("repeated", dispatchForm)}
                inputClassName={styles.input}
              >
                <option value={RepeatedDiscount.NOT_REPEATED}>
                  Ne ponavlja se
                </option>
                <option value={RepeatedDiscount.DAILY}>Svakog dana</option>
                <option value={RepeatedDiscount.SPECIFIC_DAYS}>
                  Na specifične dane u tjednu
                </option>
                <option value={RepeatedDiscount.WEEKLY}>Svakog tjedna</option>
                <option value={RepeatedDiscount.MONTHLY}>Svakog mjeseca</option>
              </InputSection>
              <p className={styles.subtitle}>Vrijeme početka popusta</p>
              <div className={styles.dateInputBox}>
                {formState.repeated.value === RepeatedDiscount.NOT_REPEATED && (
                  <div className={styles.dateBox}>
                    <InputSection
                      state={formState.fromDateDay}
                      label={"Dan"}
                      type={"number"}
                      name={"fromDateDay"}
                      placeholder={"1 - 31"}
                      errorText={"Dan mora biti između 1 - 31"}
                      onChange={getOnChangeHandler("fromDateDay", dispatchForm)}
                      onBlur={getOnBlurHandler("fromDateDay", dispatchForm)}
                      inputClassName={styles.input}
                    />
                    <InputSection
                      state={formState.fromMonth}
                      label={"Mjesec"}
                      type={"number"}
                      name={"fromMonth"}
                      placeholder={"1 - 12"}
                      errorText={"Mjesec mora biti između 1 - 12"}
                      onChange={getOnChangeHandler("fromMonth", dispatchForm)}
                      onBlur={getOnBlurHandler("fromMonth", dispatchForm)}
                      inputClassName={styles.input}
                    />
                    <InputSection
                      state={formState.fromYear}
                      label={"Godina"}
                      type={"number"}
                      name={"fromYear"}
                      placeholder={"Godina"}
                      errorText={`Godina mora biti barem ${new Date().getFullYear()}`}
                      onChange={getOnChangeHandler("fromYear", dispatchForm)}
                      onBlur={getOnBlurHandler("fromYear", dispatchForm)}
                      inputClassName={styles.input}
                    />
                  </div>
                )}
                {formState.repeated.value === RepeatedDiscount.MONTHLY && (
                  <InputSection
                    state={formState.fromDateDay}
                    label={"Dan"}
                    type={"number"}
                    name={"fromDateDay"}
                    placeholder={"1 - 31"}
                    errorText={"Dan mora biti između 1 - 31"}
                    onChange={getOnChangeHandler("fromDateDay", dispatchForm)}
                    onBlur={getOnBlurHandler("fromDateDay", dispatchForm)}
                    inputClassName={styles.input}
                  />
                )}
                {formState.repeated.value === RepeatedDiscount.WEEKLY && (
                  <InputSection
                    state={formState.fromDayInWeek}
                    label={"Dan u tjednu"}
                    type={"select"}
                    name={"fromDayInWeek"}
                    placeholder={""}
                    onChange={getOnChangeHandler("fromDayInWeek", dispatchForm)}
                    onBlur={getOnBlurHandler("fromDayInWeek", dispatchForm)}
                    inputClassName={styles.input}
                  >
                    <option value={1}>Pon</option>
                    <option value={2}>Uto</option>
                    <option value={3}>Sri</option>
                    <option value={4}>Čet</option>
                    <option value={5}>Pet</option>
                    <option value={6}>Sub</option>
                    <option value={0}>Ned</option>
                  </InputSection>
                )}
                <div className={styles.timeBox}>
                  <InputSection
                    state={formState.fromH}
                    label={"Sati"}
                    type={"number"}
                    name={"fromH"}
                    placeholder={"h"}
                    errorText={"Sati moraju biti između 0 - 23"}
                    onChange={getOnChangeHandler("fromH", dispatchForm)}
                    onBlur={getOnBlurHandler("fromH", dispatchForm)}
                    inputClassName={styles.input}
                  />
                  <InputSection
                    state={formState.fromMin}
                    label={"Minute"}
                    type={"number"}
                    name={"fromMin"}
                    placeholder={"min"}
                    errorText={"Minute moraju biti između 0 - 59"}
                    onChange={getOnChangeHandler("fromMin", dispatchForm)}
                    onBlur={getOnBlurHandler("fromMin", dispatchForm)}
                    inputClassName={styles.input}
                  />
                </div>
              </div>
              <p className={styles.subtitle}>Vrijeme kraja popusta</p>
              <div className={styles.dateInputBox}>
                {formState.repeated.value === RepeatedDiscount.NOT_REPEATED && (
                  <div className={styles.dateBox}>
                    <InputSection
                      state={formState.toDateDay}
                      label={"Dan"}
                      type={"number"}
                      name={"toDateDay"}
                      placeholder={"1 - 31"}
                      errorText={"Dan mora biti između 1 - 31"}
                      onChange={getOnChangeHandler("toDateDay", dispatchForm)}
                      onBlur={getOnBlurHandler("toDateDay", dispatchForm)}
                      inputClassName={styles.input}
                    />
                    <InputSection
                      state={formState.toMonth}
                      label={"Mjesec"}
                      type={"number"}
                      name={"toMonth"}
                      placeholder={"1 - 12"}
                      errorText={"Mjesec mora biti između 1 - 12"}
                      onChange={getOnChangeHandler("toMonth", dispatchForm)}
                      onBlur={getOnBlurHandler("toMonth", dispatchForm)}
                      inputClassName={styles.input}
                    />
                    <InputSection
                      state={formState.toYear}
                      label={"Godina"}
                      type={"number"}
                      name={"toYear"}
                      placeholder={"Godina"}
                      errorText={`Godina mora biti barem ${new Date().getFullYear()}`}
                      onChange={getOnChangeHandler("toYear", dispatchForm)}
                      onBlur={getOnBlurHandler("toYear", dispatchForm)}
                      inputClassName={styles.input}
                    />
                  </div>
                )}
                {formState.repeated.value === RepeatedDiscount.MONTHLY && (
                  <InputSection
                    state={formState.toDateDay}
                    label={"Dan"}
                    type={"number"}
                    name={"toDateDay"}
                    placeholder={"1 - 31"}
                    errorText={"Dan mora biti između 1 - 31"}
                    onChange={getOnChangeHandler("toDateDay", dispatchForm)}
                    onBlur={getOnBlurHandler("toDateDay", dispatchForm)}
                    inputClassName={styles.input}
                  />
                )}
                {formState.repeated.value === RepeatedDiscount.WEEKLY && (
                  <InputSection
                    state={formState.toDayInWeek}
                    label={"Dan u tjednu"}
                    type={"select"}
                    name={"toDayInWeek"}
                    placeholder={""}
                    onChange={getOnChangeHandler("toDayInWeek", dispatchForm)}
                    onBlur={getOnBlurHandler("toDayInWeek", dispatchForm)}
                    inputClassName={styles.input}
                  >
                    <option value={1}>Pon</option>
                    <option value={2}>Uto</option>
                    <option value={3}>Sri</option>
                    <option value={4}>Čet</option>
                    <option value={5}>Pet</option>
                    <option value={6}>Sub</option>
                    <option value={0}>Ned</option>
                  </InputSection>
                )}
                <div className={styles.timeBox}>
                  <InputSection
                    state={formState.toH}
                    label={"Sati"}
                    type={"number"}
                    name={"toH"}
                    placeholder={"h"}
                    errorText={"Sati moraju biti između 0 - 23"}
                    onChange={getOnChangeHandler("toH", dispatchForm)}
                    onBlur={getOnBlurHandler("toH", dispatchForm)}
                    inputClassName={styles.input}
                  />
                  <InputSection
                    state={formState.toMin}
                    label={"Minute"}
                    type={"number"}
                    name={"toMin"}
                    placeholder={"min"}
                    errorText={"Minute moraju biti između 0 - 59"}
                    onChange={getOnChangeHandler("toMin", dispatchForm)}
                    onBlur={getOnBlurHandler("toMin", dispatchForm)}
                    inputClassName={styles.input}
                  />
                </div>
              </div>
              {formState.repeated.value === RepeatedDiscount.SPECIFIC_DAYS && (
                <>
                  <p className={styles.subtitle}>
                    Dani kada se popust ponavlja
                  </p>
                  <div className={styles.selectDaysBox}>
                    {["pon", "uto", "sri", "čet", "pet", "sub", "ned"].map(
                      (day, i) => {
                        const dayNumber = (i + 1) % 7;
                        return (
                          <div key={dayNumber}>
                            <input
                              type="checkbox"
                              name={day}
                              id={day}
                              value={getRepeatedDayFromNumber(dayNumber)}
                              checked={formState.repeatedDays.value.includes(
                                getRepeatedDayFromNumber(dayNumber)
                              )}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                dispatchForm({
                                  type: "CHECKBOX",
                                  field: "repeatedDays",
                                  payload: {
                                    checked: e.target.checked,
                                    value: +e.target.value,
                                  },
                                });
                              }}
                            />
                            <label htmlFor={day}>{toTitleCase(day)}</label>
                          </div>
                        );
                      }
                    )}
                  </div>
                </>
              )}
            </div>
            <div>
              <Button className={styles.btn__add}>Dodaj popust</Button>
            </div>
          </div>
          <div className={styles.content__side}>
            <div className={styles.products}>
              <h3 className={styles.sideTitle}>Proizvodi</h3>
              <div>
                {products
                  .reduce((items, el) => {
                    if (formState.productIds.value.includes(el.id))
                      return [el, ...items];
                    return [...items, el];
                  }, [] as ProductDto[])
                  .map((product) => (
                    <ModalProductItem
                      product={product}
                      isChecked={formState.productIds.value.includes(
                        product.id
                      )}
                      changeHandler={(e: ChangeEvent<HTMLInputElement>) => {
                        dispatchForm({
                          type: "CHECKBOX",
                          field: "productIds",
                          payload: {
                            checked: e.target.checked,
                            value: +e.target.value,
                          },
                        });
                      }}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </BaseModal>
    </form>
  );
};

export default DiscountModal;
