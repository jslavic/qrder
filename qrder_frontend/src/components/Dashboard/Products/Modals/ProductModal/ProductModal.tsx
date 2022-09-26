import React, {
  ChangeEvent,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import validator from "validator";
import { ProductDto } from "../../../../../constants/dto/items/product.dto";
import Button from "../../../../Common/Buttons/Button/Button";
import InputSection from "../../../../Form/InputSection/InputSection";
import BaseModal from "../../../../Common/BaseModal/BaseModal";
import AddonItem from "./AddonItem/AddonItem";
import DiscountItem from "./DiscountItem/DiscountItem";
import {
  formReducer,
  State as StateInterface,
  ActionGeneric,
} from "../../../../../reducers/formReucer";
import styles from "./ProductModal.module.css";
import { StatePropertyValue } from "../../../../../constants/types/form.types";
import { getOnChangeHandler } from "../../../../../helpers/form/getOnChangeHandler.helper";
import { getOnBlurHandler } from "../../../../../helpers/form/getOnBlurHandler.helper";
import { URL as SiteURL } from "../../../../../constants/config/url";
import useFetch from "../../../../../hooks/useFetch";
import { DiscountDto } from "../../../../../constants/dto/items/discount.dto";
import { AddonDto } from "../../../../../constants/dto/items/addon.dto";

type Props = {
  product?: ProductDto;
  modifyProduct: (item: ProductDto) => void;
  discounts: DiscountDto[];
  setDiscounts: React.Dispatch<React.SetStateAction<DiscountDto[]>>;
  addons: AddonDto[];
  setAddons: React.Dispatch<React.SetStateAction<AddonDto[]>>;
  closeModal: () => void;
};

interface State extends StateInterface {
  name: StatePropertyValue<string>;
  price: StatePropertyValue<string>;
  description: StatePropertyValue<string>;
  discountIds: StatePropertyValue<number[]>;
  addonIds: StatePropertyValue<number[]>;
}

type FormFields = "name" | "price" | "description" | "discountIds" | "addonIds";

const getInitialState = (initialState?: ProductDto) => {
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
    description: {
      value: initialState?.description || "",
      isTouched: false,
      isValid: initialState ? true : false,
      validator: (value) => {
        return validator.isLength(value.trim(), { min: 1 });
      },
    },
    discountIds: {
      value: initialState?.discountIds || ([] as number[]),
      isTouched: false,
      isValid: true,
      validator: (value) => {
        return value.reduce((prev, curr) => {
          return prev && Number.isInteger(curr);
        }, true);
      },
    },
    addonIds: {
      value: initialState?.addonIds || ([] as number[]),
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

const productUrl = `${SiteURL}/dashboard/product`;

const ProductModal = ({
  product,
  discounts,
  setDiscounts,
  addons,
  setAddons,
  modifyProduct,
  closeModal,
}: Props) => {
  const [formState, dispatchForm] = useReducer<
    React.Reducer<State, ActionGeneric<FormFields>>
  >(formReducer, getInitialState(product));
  const { state: fetchState, doFetch } = useFetch<ProductDto>(productUrl);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatchForm({ type: "SUBMIT", field: "name" });

    const formData = new FormData();
    if (selectedFile) formData.append("file", selectedFile);
    formData.append("name", formState.name.value);
    formData.append("price", formState.price.value);
    formData.append("description", formState.description.value);
    formState.discountIds.value.forEach((discount) =>
      formData.append("discountIds[]", "" + discount)
    );
    formState.addonIds.value.forEach((addon) =>
      formData.append("addonIds[]", "" + addon)
    );

    product
      ? doFetch(
          {
            method: "PATCH",
            credentials: "include",
            body: formData,
          },
          `${productUrl}/${product.id}`
        )
      : doFetch({
          method: "POST",
          credentials: "include",
          body: formData,
        });
  };

  useEffect(() => {
    if (!fetchState.data) return;
    modifyProduct(fetchState.data);
    fetchState.data!.discountIds &&
      setDiscounts((prev) => {
        return prev.map((discount) => {
          if (
            (fetchState.data!.discountIds.includes(discount.id) &&
              discount.productIds.includes(fetchState.data!.id)) ||
            (!fetchState.data!.discountIds.includes(discount.id) &&
              !discount.productIds.includes(fetchState.data!.id))
          )
            return discount;
          if (
            !fetchState.data!.discountIds.includes(discount.id) &&
            discount.productIds.includes(fetchState.data!.id)
          ) {
            discount.productIds = discount.productIds.filter(
              (productId) => productId !== fetchState.data!.id
            );
            return discount;
          }
          if (
            fetchState.data!.discountIds.includes(discount.id) &&
            !discount.productIds.includes(fetchState.data!.id)
          ) {
            discount.productIds.push(fetchState.data!.id);
            return discount;
          }
          return discount;
        });
      });
    fetchState.data!.addonIds &&
      setAddons((prev) => {
        return prev.map((addon) => {
          if (
            (fetchState.data!.addonIds.includes(addon.id) &&
              addon.productIds.includes(fetchState.data!.id)) ||
            (!fetchState.data!.addonIds.includes(addon.id) &&
              !addon.productIds.includes(fetchState.data!.id))
          )
            return addon;
          if (
            !fetchState.data!.addonIds.includes(addon.id) &&
            addon.productIds.includes(fetchState.data!.id)
          ) {
            addon.productIds = addon.productIds.filter(
              (productId) => productId !== fetchState.data!.id
            );
            return addon;
          }
          if (
            fetchState.data!.addonIds.includes(addon.id) &&
            !addon.productIds.includes(fetchState.data!.id)
          ) {
            addon.productIds.push(fetchState.data!.id);
            return addon;
          }
          return addon;
        });
      });
    closeModal();
  }, [fetchState.data, closeModal, modifyProduct, setDiscounts, setAddons]);

  return (
    <BaseModal closeModal={closeModal}>
      <form onSubmit={handleSubmit}>
        <h2 className={styles.title}>Novi Proizvod</h2>
        <div className={styles.content}>
          <div className={styles.content__main}>
            <div>
              <InputSection
                state={formState.name}
                label={"Ime"}
                type={"text"}
                name={"name"}
                placeholder={"Ime Proizvoda"}
                errorText={"Ime proizvoda mora biti definirano"}
                onChange={getOnChangeHandler("name", dispatchForm)}
                onBlur={getOnBlurHandler("name", dispatchForm)}
                inputClassName={styles.input}
              />
              <InputSection
                state={formState.price}
                label={"Cijena"}
                type={"number"}
                name={"price"}
                placeholder={"Cijena Proizvoda"}
                errorText={"Unesite važeću cijenu"}
                onChange={getOnChangeHandler("price", dispatchForm)}
                onBlur={getOnBlurHandler("price", dispatchForm)}
                inputClassName={styles.input}
              />
              <InputSection
                state={formState.description}
                label={"Opis"}
                type={"text"}
                name={"description"}
                placeholder={"Opis Proizvoda"}
                errorText={"Opis proizvoda mora biti definiran"}
                onChange={getOnChangeHandler("description", dispatchForm)}
                onBlur={getOnBlurHandler("description", dispatchForm)}
                inputClassName={styles.input}
              />
              <label htmlFor="file" className={styles.fileInput}>
                <input
                  type="file"
                  id="file"
                  name="file"
                  ref={imageInputRef}
                  onChange={() => {
                    const files = imageInputRef.current!.files;
                    if (files && files.length > 0) {
                      setSelectedFile(files[0]);
                      setImageUrl(URL.createObjectURL(files[0]));
                    }
                  }}
                />
                Učitajte sliku proizvoda (opcionalno)
              </label>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Upload"
                  className={styles.uploadedImage}
                />
              )}
            </div>
            <div>
              <Button className={styles.btn__add}>
                {product ? "Uredi" : "Dodaj"} Prozivod
              </Button>
            </div>
          </div>
          <div className={styles.content__side}>
            <div className={`${styles.discounts} ${styles.sideSection}`}>
              <h4
                className={`${styles.sideTitle} ${styles.sideTitle_discounts}`}
              >
                Popusti
              </h4>
              <div>
                {discounts
                  .reduce((items, el) => {
                    if (formState.discountIds.value.includes(el.id))
                      return [el, ...items];
                    return [...items, el];
                  }, [] as DiscountDto[])
                  .map((discount) => (
                    <DiscountItem
                      discount={discount}
                      isChecked={formState.discountIds.value.includes(
                        discount.id
                      )}
                      changeHandler={(e: ChangeEvent<HTMLInputElement>) => {
                        dispatchForm({
                          type: "CHECKBOX",
                          field: "discountIds",
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
            <div className={`${styles.addons} ${styles.sideSection}`}>
              <h4 className={`${styles.sideTitle} ${styles.sideTitle_addons}`}>
                Dodatci
              </h4>
              <div>
                {addons
                  .reduce((items, el) => {
                    if (formState.addonIds.value.includes(el.id))
                      return [el, ...items];
                    return [...items, el];
                  }, [] as AddonDto[])
                  .map((addon) => (
                    <AddonItem
                      addon={addon}
                      isChecked={formState.addonIds.value.includes(addon.id)}
                      changeHandler={(e: ChangeEvent<HTMLInputElement>) => {
                        dispatchForm({
                          type: "CHECKBOX",
                          field: "addonIds",
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
      </form>
    </BaseModal>
  );
};

export default ProductModal;
