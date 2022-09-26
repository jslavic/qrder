import React, { ChangeEvent } from "react";

import { StatePropertyValue } from "../../../constants/types/form.types";

import { ReactComponent as QuestionMarkSvg } from "../../../assets/help-circle.svg";

import styles from "./InputSection.module.css";
import PasswordInput from "../PasswordInput/PasswordInput";

type ValidInputValues = string | number | readonly string[] | undefined;

type Props<T extends ValidInputValues> = {
  state: StatePropertyValue<T> | string;
  label: string;
  type: string;
  name: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: () => void;
  errorText?: string;
  additionalOptions?: { [key: string]: any };
  extraContentAfter?: React.ReactNode;
  divClassName?: string;
  inputClassName?: string;
  children?: React.ReactNode;
};

const InputSection = <T extends ValidInputValues>({
  state,
  label,
  type,
  name,
  placeholder,
  errorText,
  onChange,
  onBlur,
  additionalOptions,
  extraContentAfter,
  divClassName,
  inputClassName,
  children,
}: Props<T>) => {
  return (
    <div
      className={`${styles.fieldWrapper} ${divClassName ? divClassName : ""} ${
        typeof state === "string"
          ? ""
          : state.isTouched && !state.isValid
          ? styles.invalid
          : ""
      }`}
    >
      <label htmlFor={name}>{label}</label>
      <div className={styles.inputBox}>
        {type !== "select" ? (
          type === "password" ? (
            <PasswordInput
              name={name}
              placeholder={placeholder}
              state={state}
              onChange={onChange}
              onBlur={onBlur}
            />
          ) : (
            <input
              type={type}
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
              className={`${inputClassName ? inputClassName : ""}`}
            />
          )
        ) : (
          <>
            <select
              name={name}
              id={name}
              value={typeof state === "string" ? state : state.value}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                onChange(e);
              }}
              onBlur={onBlur}
              className={`${inputClassName ? inputClassName : ""}`}
            >
              {children}
            </select>
          </>
        )}
        {typeof state !== "string" && state.isTouched && !state.isValid && (
          <>
            <div
              className={
                type !== "password"
                  ? styles.infoIconBox
                  : `${styles.infoIconBox} ${styles.infoIconBox__extraMargin}`
              }
            >
              {errorText && (
                <>
                  <QuestionMarkSvg className={styles.infoIcon} />
                  <p className={styles.infoText}>{errorText}</p>
                </>
              )}
            </div>
          </>
        )}
      </div>
      {extraContentAfter}
    </div>
  );
};

export default InputSection;
