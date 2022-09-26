import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Menu from "../../components/Menu/Menu";
import { URL } from "../../constants/config/url";
import { ProductForOrderDto } from "../../constants/dto/items/product-for-order.dto";
import useFetch from "../../hooks/useFetch";
import { RootState } from "../../store";
import { currencyActions } from "../../store/slices/currency.slice";

type Props = {};

type FetchData = {
  companyName: string;
  currency: string;
  products: ProductForOrderDto[];
};

const UserOrders = (props: Props) => {
  const { qrData } = useParams();
  const productsUrl = `${URL}/product/orders/${qrData}`;

  const { state: fetchState, doFetch } = useFetch<FetchData>(productsUrl);
  const dispatch = useDispatch();

  const [companyName, setCompanyName] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductForOrderDto[] | null>(null);
  const { currency } = useSelector((state: RootState) => state.currency);

  useEffect(() => {
    doFetch();
  }, [doFetch]);

  useEffect(() => {
    if (fetchState.data) {
      setProducts(fetchState.data.products);
      setCompanyName(fetchState.data.companyName);
      dispatch(currencyActions.setCurrency(fetchState.data.currency));
    }
  }, [fetchState.data, dispatch]);

  return (
    <>
      {products && companyName && currency && (
        <Menu products={products} companyName={companyName} />
      )}
    </>
  );
};

export default UserOrders;
