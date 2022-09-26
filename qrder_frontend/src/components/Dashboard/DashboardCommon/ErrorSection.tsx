import React from "react";

import style from "./DashboardCommon.module.css";
import FetchError from "../../Error/ErrorSection/FetchError";

type Props = {
  handleFormReload: () => void;
};

const ErrorSection = ({ handleFormReload }: Props) => {
  return (
    <div className={style.loadingBox}>
      <FetchError handleFormReload={handleFormReload} />
    </div>
  );
};

export default ErrorSection;
