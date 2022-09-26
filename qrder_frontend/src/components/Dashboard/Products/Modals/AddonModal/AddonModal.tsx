import React, { ChangeEvent, useEffect, useReducer } from "react";
import validator from "validator";
import Button from "../../../../Common/Buttons/Button/Button";
import InputSection from "../../../../Form/InputSection/InputSection";
import BaseModal from "../../../../Common/BaseModal/BaseModal";
import ModalProductItem from "../ModalProductItem/ModalProductItem";
import {
  formReducer,
  State as StateInterface,
  ActionGeneric,
} from "../../../../../reducers/formReucer";

import styles from "./AddonModal.module.css";
import { StatePropertyValue } from "../../../../../constants/types/form.types";
import { AddonDto } from "../../../../../constants/dto/items/addon.dto";
import useFetch from "../../../../../hooks/useFetch";
import { getOnChangeHandler } from "../../../../../helpers/form/getOnChangeHandler.helper";
import { getOnBlurHandler } from "../../../../../helpers/form/getOnBlurHandler.helper";
import { URL } from "../../../../../constants/config/url";
import { ProductDto } from "../../../../../constants/dto/items/product.dto";

type Props = {
  addon?: AddonDto;
  products: ProductDto[];
  setProducts: React.Dispatch<React.SetStateAction<ProductDto[]>>;
  modifyAddon: (item: AddonDto) => void;
  closeModal: () => void;
};

interface State extends StateInterface {
  name: StatePropertyValue<string>;
  price: StatePropertyValue<string>;
  productIds: StatePropertyValue<number[]>;
}

type FormFields = "name" | "price" | "productIds";

const getInitialState = (initialState?: AddonDto) => {
  return {
    name: {
      value: initialState?.name || "",
      isTouched: false,
      isValid: initialState ? true : false,
      validator: (value) => {
        return validator.isLength(value.trim(), { min: 1 });
      },
    },
    price: {
      value: initialState?.price.toString() || "",
      isTouched: false,
      isValid: initialState ? true : false,
      validator: (value) => {
        return validator.isFloat(value, { min: 0 });
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

const addonUrl = `${URL}/addon`;

const AddonModal = ({
  addon,
  products,
  setProducts,
  modifyAddon,
  closeModal,
}: Props) => {
  const [formState, dispatchForm] = useReducer<
    React.Reducer<State, ActionGeneric<FormFields>>
  >(formReducer, getInitialState(addon));
  const { state: fetchState, doFetch } = useFetch<AddonDto>(addonUrl);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatchForm({ type: "SUBMIT", field: "name" });
    const getFetchOptions = (method: "POST" | "PATCH") => ({
      method: method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formState.name.value,
        price: +formState.price.value,
        productIds: formState.productIds.value,
      }),
    });
    addon
      ? doFetch(getFetchOptions("PATCH"), `${addonUrl}/${addon.id}`)
      : doFetch(getFetchOptions("POST"));
  };

  useEffect(() => {
    if (!fetchState.data) return;
    const productIds = fetchState.data.productIds ?? formState.productIds.value;
    modifyAddon(fetchState.data);
    setProducts((prev) => {
      return prev.map((product) => {
        if (
          (productIds.includes(product.id) &&
            product.addonIds.includes(fetchState.data!.id)) ||
          (!productIds.includes(product.id) &&
            !product.addonIds.includes(fetchState.data!.id))
        )
          return product;
        if (
          !productIds.includes(product.id) &&
          product.addonIds.includes(fetchState.data!.id)
        ) {
          product.addonIds = product.addonIds.filter(
            (addonId) => addonId !== fetchState.data!.id
          );
          return product;
        }
        if (
          productIds.includes(product.id) &&
          !product.addonIds.includes(fetchState.data!.id)
        ) {
          product.addonIds.push(fetchState.data!.id);
          return product;
        }
        return product;
      });
    });
    closeModal();
  }, [
    fetchState.data,
    formState.productIds.value,
    modifyAddon,
    closeModal,
    setProducts,
  ]);

  return (
    <form onSubmit={handleSubmit}>
      <BaseModal closeModal={closeModal}>
        <h2 className={styles.title}>Novi dodatak</h2>
        <div className={styles.content}>
          <div className={styles.content__main}>
            <div>
              <InputSection
                state={formState.name}
                label={"Ime"}
                type={"text"}
                name={"name"}
                placeholder={"Ime dodatka"}
                errorText={"Ime dodatka mora biti definirano"}
                onChange={getOnChangeHandler("name", dispatchForm)}
                onBlur={getOnBlurHandler("name", dispatchForm)}
                inputClassName={styles.input}
              />
              <InputSection
                state={formState.price}
                label={"Cijena"}
                type={"number"}
                name={"price"}
                placeholder={"Upišite 0 ukoliko je dodatak besplatan"}
                errorText={"Cijena dodatka mora biti 0 ili veća"}
                onChange={getOnChangeHandler("price", dispatchForm)}
                onBlur={getOnBlurHandler("price", dispatchForm)}
                inputClassName={styles.input}
              />
            </div>
            <div>
              <Button className={styles.btn__add}>Dodaj dodatak</Button>
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

export default AddonModal;
