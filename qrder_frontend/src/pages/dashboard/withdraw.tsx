import React from "react";
import DashboardOverlay from "../../components/Dashboard/DashboardOverlay/DashboardOverlay";
import Withdraw from "../../components/Dashboard/Withdraw/Withdraw";

type Props = {};

const DashboardWithdraw = (props: Props) => {
  return (
    <DashboardOverlay>
      <Withdraw />
    </DashboardOverlay>
  );
};

export default DashboardWithdraw;
