import React from "react";
import Analytics from "../../../components/Dashboard/Analytics/Analytics";
import DashboardOverlay from "../../../components/Dashboard/DashboardOverlay/DashboardOverlay";

type Props = {};

const DashboardAnalytics = (props: Props) => {
  return (
    <DashboardOverlay>
      <Analytics />
    </DashboardOverlay>
  );
};

export default DashboardAnalytics;
