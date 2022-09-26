import React from "react";
import DashboardOverlay from "../../components/Dashboard/DashboardOverlay/DashboardOverlay";
import QRCodes from "../../components/Dashboard/QRCodes/QRCodes";

type Props = {};

const DashbaordQRCodes = (props: Props) => {
  return (
    <DashboardOverlay>
      <QRCodes />
    </DashboardOverlay>
  );
};

export default DashbaordQRCodes;
