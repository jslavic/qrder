import React, { useEffect, useReducer, useState } from "react";
import Button from "../../Common/Buttons/Button/Button";
import ProductItem from "./Items/ProductItem/ProductItem";
import { modalReducer, State, Action } from "../../../reducers/modalReducer";

import styles from "./Products.module.css";
import ProductModal from "./Modals/ProductModal/ProductModal";
import DiscountModal from "./Modals/DiscountModal/DiscountModal";
import AddonModal from "./Modals/AddonModal/AddonModal";
import DeleteModal from "./Modals/DeleteModal/DeleteModal";
import useFetch from "../../../hooks/useFetch";
import {
  ProductDto,
  ProductDtoWithRelations,
} from "../../../constants/dto/items/product.dto";
import { URL } from "../../../constants/config/url";
import {
  DiscountDto,
  DiscountDtoWithRelations,
} from "../../../constants/dto/items/discount.dto";
import {
  AddonDto,
  AddonDtoWithRelations,
} from "../../../constants/dto/items/addon.dto";
import DiscountItem from "./Items/DiscountItem/DiscountItem";
import AddonItem from "./Items/AddonItem/AddonItem";
import LoadingSection from "../DashboardCommon/LoadingSection";
import ErrorSection from "../DashboardCommon/ErrorSection";

type Props = {};

const initialState: State = {
  product: { type: false, item: undefined },
  discount: { type: false, item: undefined },
  addon: { type: false, item: undefined },
};

const modifyItem = <T extends ProductDto | DiscountDto | AddonDto>(
  setItems: React.Dispatch<React.SetStateAction<T[]>>,
  item: T
) => {
  console.log(item);
  setItems((prev) => {
    const index = prev.findIndex(
      (itemFromArray) => itemFromArray.id === item.id
    );
    index === -1 ? prev.push(item) : (prev[index] = item);
    return prev;
  });
};

const deleteItem = <T extends ProductDto | DiscountDto | AddonDto>(
  setItems: React.Dispatch<React.SetStateAction<T[]>>,
  item: T
) => {
  setItems((prev) => {
    const index = prev.findIndex(
      (itemFromArray) => itemFromArray.id === item.id
    );
    prev.splice(index, 1);
    return prev;
  });
};

const getItemsUrl = `${URL}/dashboard`;

const Products = (props: Props) => {
  const { state: fetchState, doFetch } = useFetch<{
    products: ProductDtoWithRelations[];
    discounts: DiscountDtoWithRelations[];
    addons: AddonDtoWithRelations[];
  }>(getItemsUrl);

  const [products, setProducts] = useState<ProductDto[]>([]);
  const [discounts, setDiscounts] = useState<DiscountDto[]>([]);
  const [addons, setAddons] = useState<AddonDto[]>([]);

  const [modalState, dispatch] = useReducer<React.Reducer<State, Action>>(
    modalReducer,
    initialState
  );

  useEffect(() => {
    doFetch({ method: "GET", credentials: "include" });
  }, [doFetch]);

  useEffect(() => {
    if (!fetchState.data) return;

    const productData = fetchState.data.products.map((product) => ({
      ...product,
      discountIds: product.discounts.map((discount) => discount.id),
      addonIds: product.addons.map((addon) => addon.id),
    }));

    const discountData = fetchState.data.discounts.map((discount) => ({
      ...discount,
      productIds: discount.products.map((product) => product.id),
    }));

    const addonData = fetchState.data.addons.map((addon) => ({
      ...addon,
      productIds: addon.products.map((product) => product.id),
    }));

    setProducts(productData);
    setDiscounts(discountData);
    setAddons(addonData);
  }, [fetchState, setProducts, setDiscounts, setAddons]);

  console.log(discounts);

  if (fetchState.error)
    return (
      <ErrorSection
        handleFormReload={() =>
          doFetch({ method: "GET", credentials: "include" })
        }
      />
    );

  if (fetchState.isLoading) return <LoadingSection />;

  if (fetchState.data)
    return (
      <>
        {modalState.product.type === "ADD" && (
          <ProductModal
            discounts={discounts}
            setDiscounts={setDiscounts}
            addons={addons}
            setAddons={setAddons}
            modifyProduct={(item: ProductDto) => {
              modifyItem(setProducts, item);
            }}
            closeModal={() => {
              dispatch({ type: "CLOSE" });
            }}
          />
        )}
        {modalState.product.type === "EDIT" && (
          <ProductModal
            discounts={discounts}
            setDiscounts={setDiscounts}
            addons={addons}
            setAddons={setAddons}
            product={modalState.product.item}
            modifyProduct={(item: ProductDto) => {
              modifyItem(setProducts, item);
            }}
            closeModal={() => {
              dispatch({ type: "CLOSE" });
            }}
          />
        )}
        {modalState.product.type === "DELETE" && (
          <DeleteModal
            type="PRODUCT"
            deleteItem={() => deleteItem(setProducts, modalState.product.item!)}
            item={modalState.product.item!}
            closeModal={() => {
              dispatch({ type: "CLOSE" });
            }}
          />
        )}
        {modalState.discount.type === "ADD" && (
          <DiscountModal
            products={products}
            setProducts={setProducts}
            modifyDiscount={(item: DiscountDto) => {
              modifyItem(setDiscounts, item);
            }}
            closeModal={() => {
              dispatch({ type: "CLOSE" });
            }}
          />
        )}
        {modalState.discount.type === "EDIT" && (
          <DiscountModal
            products={products}
            setProducts={setProducts}
            discount={modalState.discount.item}
            modifyDiscount={(item: DiscountDto) => {
              modifyItem(setDiscounts, item);
            }}
            closeModal={() => {
              dispatch({ type: "CLOSE" });
            }}
          />
        )}
        {modalState.discount.type === "DELETE" && (
          <DeleteModal
            type="DISCOUNT"
            deleteItem={() =>
              deleteItem(setDiscounts, modalState.discount.item!)
            }
            item={modalState.discount.item!}
            closeModal={() => {
              dispatch({ type: "CLOSE" });
            }}
          />
        )}
        {modalState.addon.type === "ADD" && (
          <AddonModal
            products={products}
            setProducts={setProducts}
            modifyAddon={(item: AddonDto) => {
              modifyItem(setAddons, item);
            }}
            closeModal={() => {
              dispatch({ type: "CLOSE" });
            }}
          />
        )}
        {modalState.addon.type === "EDIT" && (
          <AddonModal
            products={products}
            setProducts={setProducts}
            addon={modalState.addon.item}
            modifyAddon={(item: AddonDto) => {
              modifyItem(setAddons, item);
            }}
            closeModal={() => {
              dispatch({ type: "CLOSE" });
            }}
          />
        )}
        {modalState.addon.type === "DELETE" && (
          <DeleteModal
            type="ADDON"
            deleteItem={() => deleteItem(setAddons, modalState.addon.item!)}
            item={modalState.addon.item!}
            closeModal={() => {
              dispatch({ type: "CLOSE" });
            }}
          />
        )}
        <div className={styles.mainBox}>
          <div className={styles.contentBox}>
            <div className={styles.titleBox}>
              <h2 className={styles.title}>Vaši proizvodi</h2>
              <div className={styles.titleButtons}>
                <Button className={`${styles.btn} ${styles.btn__addon}`}>
                  Novi dodatak
                </Button>
                <Button
                  className={`${styles.btn} ${styles.btn__discount}`}
                  onClick={() => {
                    dispatch({ type: { field: "DISCOUNT", action: "ADD" } });
                  }}
                >
                  Novi popust
                </Button>
                <Button
                  className={`${styles.btn} ${styles.btn__product}`}
                  onClick={() => {
                    dispatch({ type: { field: "PRODUCT", action: "ADD" } });
                  }}
                >
                  Novi proizvod
                </Button>
              </div>
            </div>

            <table className={styles.productsTable}>
              <thead>
                <tr>
                  <th>SLIKA</th>
                  <th>IME</th>
                  <th>CIJENA</th>
                  <th>OPIS</th>
                  <th>NAPRAVLJENO</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <ProductItem
                    product={product}
                    key={product.id}
                    modalDispatch={dispatch}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.mainBox}>
          <div className={styles.contentBox}>
            <div className={styles.titleBox}>
              <h2 className={`${styles.title} ${styles.title__green}`}>
                Vaši popusti
              </h2>
              <div className={styles.titleButtons}>
                <Button
                  className={`${styles.btn} ${styles.btn__discount}`}
                  onClick={() => {
                    dispatch({ type: { field: "DISCOUNT", action: "ADD" } });
                  }}
                >
                  Novi popust
                </Button>
              </div>
            </div>

            <table className={styles.productsTable}>
              <thead>
                <tr>
                  <th>IME</th>
                  <th>PONAVLJANJE</th>
                  <th>TRAJANJE</th>
                  <th>KOLIČINA</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {discounts.map((discount) => (
                  <DiscountItem
                    discount={discount}
                    key={discount.id}
                    modalDispatch={dispatch}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.mainBox}>
          <div className={styles.contentBox}>
            <div className={styles.titleBox}>
              <h2 className={`${styles.title} ${styles.title__blue}`}>
                Vaši dodatci
              </h2>
              <div className={styles.titleButtons}>
                <Button
                  className={`${styles.btn} ${styles.btn__addon}`}
                  onClick={() => {
                    dispatch({ type: { field: "ADDON", action: "ADD" } });
                  }}
                >
                  Novi dodatak
                </Button>
              </div>
            </div>

            <table className={styles.productsTable}>
              <thead>
                <tr>
                  <th>IME</th>
                  <th>CIJENA</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {addons.map((addon) => (
                  <AddonItem
                    addon={addon}
                    key={addon.id}
                    modalDispatch={dispatch}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );

  return <LoadingSection />;
};

export default Products;
