import React from "react";
import DashboardOverlay from "../../components/Dashboard/DashboardOverlay/DashboardOverlay";
import Orders from "../../components/Dashboard/Orders/Orders";

type Props = {};

const DashboardOrders = (props: Props) => {
  return (
    <DashboardOverlay>
      <Orders />
    </DashboardOverlay>
  );
};

export default DashboardOrders;
