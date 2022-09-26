import React from "react";
import AnalyticsProductItem from "../../../components/Dashboard/Analytics/AnalyticsProductItem/AnalyticsProductItem";
import DashboardOverlay from "../../../components/Dashboard/DashboardOverlay/DashboardOverlay";

type Props = {};

const DashboardAnalyticsProductItem = (props: Props) => {
  return (
    <DashboardOverlay>
      <AnalyticsProductItem />
    </DashboardOverlay>
  );
};

export default DashboardAnalyticsProductItem;
