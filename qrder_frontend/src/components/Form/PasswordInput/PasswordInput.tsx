import React, { ChangeEvent, useState } from "react";
import { StatePropertyValue } from "../../../constants/types/form.types";

import { ReactComponent as ShowSvg } from "../../../assets/show.svg";
import { ReactComponent as HideSvg } from "../../../assets/hide.svg";

import styles from "./PasswordInput.module.css";

type Props = {
  state: StatePropertyValue<any> | string;
  name: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: () => void;
  additionalOptions?: { [key: string]: any };
};

const PasswordInput = ({
  state,
  name,
  placeholder,
  onChange,
  onBlur,
  additionalOptions,
}: Props) => {
  const [showPassword, setShowPassword] = useState(true);

  return (
    <>
      <input
        type={showPassword ? "password" : "text"}
        name={name}
        id={name}
        placeholder={placeholder}
        value={typeof state === "string" ? state : state.value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          onChange(e);
        }}
        onBlur={onBlur}
        {...additionalOptions}
        required
      />
      <div
        className={styles.btn}
        role={"button"}
        onClick={() => {
          setShowPassword((prevValue) => !prevValue);
        }}
      >
        {showPassword ? <ShowSvg /> : <HideSvg />}
      </div>
    </>
  );
};

export default PasswordInput;
