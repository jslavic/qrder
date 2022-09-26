import React from "react";
import DashboardOverlay from "../../components/Dashboard/DashboardOverlay/DashboardOverlay";
import History from "../../components/Dashboard/History/History";

type Props = {};

const DashboardHistory = (props: Props) => {
  return (
    <DashboardOverlay>
      <History />
    </DashboardOverlay>
  );
};

export default DashboardHistory;
