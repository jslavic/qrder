import React, { useState } from "react";
import { ProductForOrderDto } from "../../constants/dto/items/product-for-order.dto";
import AddItemModal from "./AddItemModal/AddItemModal";

import styles from "./Menu.module.css";
import MenuItem from "./MenuItem/MenuItem";
import OrderModal from "./OrderModal/OrderModal";

type Props = {
  companyName: string;
  products: ProductForOrderDto[];
};

export interface MenuItemType extends ProductForOrderDto {
  id: number;
  quantity: number;
  fullPrice: number;
  extrasIds?: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
}

const Menu = ({ companyName, products }: Props) => {
  const [modalItem, setModalItem] = useState<ProductForOrderDto | null>(null);
  const [orderItems, setOrderItems] = useState<MenuItemType[]>([]);

  const handleAddItem = (item: MenuItemType) => {
    setOrderItems((prev) => {
      const itemIndex = prev.findIndex(
        (existingItem) => existingItem.id === item.id
      );
      if (itemIndex === -1) prev.push(item);
      else {
        if (item.quantity === 0) prev.splice(itemIndex, 1);
        else prev[itemIndex] = item;
      }
      return [...prev];
    });
  };

  console.log(orderItems);

  return (
    <div className={styles.content}>
      <h1 className={styles.companyName}>Ime kompanije ovdje</h1>
      {modalItem && (
        <AddItemModal
          product={modalItem}
          orderItem={orderItems.find((item) => item.id === modalItem.id)}
          onAddItem={handleAddItem}
          closeModal={() => setModalItem(null)}
        />
      )}
      <div className={styles.items}>
        {products.map((product) => (
          <MenuItem
            product={product}
            orderItem={orderItems.find((item) => item.id === product.id)}
            onAddItem={handleAddItem}
            modalOpen={() => {
              setModalItem(product);
            }}
          />
        ))}
      </div>
      <OrderModal
        orderItems={orderItems}
        onAddItem={handleAddItem}
        setModalItem={(id: number) => {
          setModalItem(products.find((item) => item.id === id) || null);
        }}
      />
    </div>
  );
};

export default Menu;
