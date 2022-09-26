import React from "react";
import Button from "../../Common/Buttons/Button/Button";

import { ReactComponent as ErrorIcon } from "../../../assets/x-circle.svg";
import { ReactComponent as RetryIcon } from "../../../assets/retry.svg";

import style from "./FetchError.module.css";

type Props = {
  handleFormReload: () => void;
};

const FetchError = ({ handleFormReload }: Props) => {
  return (
    <div className={style.centered}>
      <ErrorIcon className={style.icon} />
      <p className={style.textError}>Nismo uspjeli učitati podatke</p>
      <Button className={style.btn__error} onClick={handleFormReload}>
        <RetryIcon className={style.retryIcon} />
        Pokušajte ponovo
      </Button>
    </div>
  );
};

export default FetchError;
