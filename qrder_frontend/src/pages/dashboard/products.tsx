import React from "react";
import DashboardOverlay from "../../components/Dashboard/DashboardOverlay/DashboardOverlay";
import Products from "../../components/Dashboard/Products/Products";

type Props = {};

const DashboardProducts = (props: Props) => {
  return (
    <DashboardOverlay>
      <Products />
    </DashboardOverlay>
  );
};

export default DashboardProducts;
