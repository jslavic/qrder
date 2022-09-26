import React from "react";
import LoadingSpinner from "../../Common/LoadingSpinner/LoadingSpinner";

import style from "./DashboardCommon.module.css";

type Props = {};

const LoadingSection = (props: Props) => {
  return (
    <div className={style.loadingBox}>
      <LoadingSpinner size={60} />
    </div>
  );
};

export default LoadingSection;
