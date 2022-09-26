import React, { useEffect, useMemo, useState } from "react";
import Button from "../../Common/Buttons/Button/Button";
import AddonCard from "./AddonCard/AddonCard";
import { MenuItemType } from "../Menu";

import { ReactComponent as CloseIcon } from "../../../assets/x.svg";
import { ReactComponent as AddIcon } from "../../../assets/plus.svg";
import { ReactComponent as RemoveIcon } from "../../../assets/minus.svg";
import { ProductForOrderDto } from "../../../constants/dto/items/product-for-order.dto";

import styles from "./AddItemModal.module.css";
import genericStyles from "../MenuModal.module.css";
import menuItemStyles from "../MenuItem/MenuItem.module.css";
import { formatPrice } from "../../../helpers/general/formatPrice";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const body = document.querySelector("body");

type Props = {
  product: ProductForOrderDto;
  orderItem?: MenuItemType;
  onAddItem: (item: MenuItemType) => void;
  closeModal: () => void;
};

type ExtrasItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

const AddItemModal = ({ product, orderItem, onAddItem, closeModal }: Props) => {
  const [quantity, setQuantity] = useState(orderItem?.quantity || 1);
  const [extraItems, setExtraItems] = useState<ExtrasItem[]>(
    orderItem?.extrasIds || []
  );
  const { currency } = useSelector((state: RootState) => state.currency);

  useEffect(() => {
    body!.style.overflow = "hidden";

    return () => {
      body!.style.overflow = "auto";
    };
  }, []);

  const extrasPrice = useMemo(
    () =>
      extraItems.reduce((prev, curr) => prev + curr.price * curr.quantity, 0),
    [extraItems]
  );

  const handleAddItem = () => {
    onAddItem({
      ...product,
      quantity,
      fullPrice: product.discount
        ? product.discount.discountPrice * quantity + extrasPrice
        : product.price * quantity + extrasPrice,
      extrasIds: extraItems.length === 0 ? undefined : extraItems,
    });
    closeModal();
  };

  return (
    <div className={genericStyles.modal} onClick={closeModal}>
      <div
        className={genericStyles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseIcon className={genericStyles.close} onClick={closeModal} />
        <div className={genericStyles.content}>
          <div className={genericStyles.scrollableContent}>
            <div className={styles.info}>
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt="name"
                  className={styles.image}
                />
              )}
              <div className={styles.infoText}>
                <p className={menuItemStyles.titleBox}>
                  <span className={styles.title}>{product.name} </span>
                  {product.discount && (
                    <span className={menuItemStyles.discount}>
                      -{product.discount.discountAmount}
                    </span>
                  )}
                </p>
                <div className={styles.priceBox}>
                  {product.discount ? (
                    <>
                      <p className={styles.price}>
                        {formatPrice(product.discount.discountPrice)}
                        {currency}
                      </p>
                      <p className={styles.originalPrice}>
                        ({formatPrice(product.price)}
                        {currency})
                      </p>
                    </>
                  ) : (
                    <p className={styles.price}>
                      {formatPrice(product.price)}
                      {currency}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <p className={styles.desc}>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. In
              debitis atque repudiandae quam cupiditate explicabo accusantium.
              Beatae sunt id maiores dignissimos, consequuntur similique.
              Dolorum maxime, quia doloremque nostrum reprehenderit ab?
            </p>
            {product.addons.length > 0 && (
              <div>
                <p className={styles.extrasTitle}>Odaberite Dodatke</p>
                {product.addons.map((addon) => (
                  <AddonCard
                    addon={addon}
                    orderAdoon={orderItem?.extrasIds?.find(
                      (existingAddon) => existingAddon.id === addon.id
                    )}
                    setExtraItems={setExtraItems}
                  />
                ))}
              </div>
            )}
          </div>
          <div className={styles.actions}>
            <div className={styles.btnBox}>
              <button
                className={styles.btn}
                onClick={() => {
                  setQuantity((prev) => Math.max(1, prev - 1));
                }}
              >
                <RemoveIcon className={styles.icon} />
              </button>
              <p className={styles.orderAmount}>{quantity}</p>
              <button
                className={styles.btn}
                onClick={() => {
                  setQuantity((prev) => Math.min(50, prev + 1));
                }}
              >
                <AddIcon className={styles.icon} />
              </button>
            </div>

            <Button className={styles.submitBtn} onClick={handleAddItem}>
              Dodaj {quantity} za{" "}
              {product.discount
                ? `${formatPrice(
                    product.discount.discountPrice * quantity + extrasPrice
                  )} ${currency}`
                : `${formatPrice(
                    product.price * quantity + extrasPrice
                  )} ${currency}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
