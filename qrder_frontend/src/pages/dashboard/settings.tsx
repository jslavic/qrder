import React from "react";
import DashboardOverlay from "../../components/Dashboard/DashboardOverlay/DashboardOverlay";
import Settings from "../../components/Dashboard/Settings/Settings";

type Props = {};

const DashboardSettings = (props: Props) => {
  return (
    <DashboardOverlay>
      <Settings />
    </DashboardOverlay>
  );
};

export default DashboardSettings;
