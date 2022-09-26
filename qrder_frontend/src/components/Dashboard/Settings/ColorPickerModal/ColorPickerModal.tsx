import React, { useState } from "react";
import { RgbColorPicker } from "react-colorful";
import BaseModal from "../../../Common/BaseModal/BaseModal";
import Button from "../../../Common/Buttons/Button/Button";

import { ReactComponent as AlertIcon } from "../../../../assets/alert-circle.svg";

import styles from "./ColorPickerModal.module.css";

type Props = {
  closeModal: () => void;
};

type RGB = { r: number; g: number; b: number };

type ColorState = {
  currentMode: "lightMode" | "darkMode";
  lightMode: RGB;
  darkMode: RGB;
};

const convertToRgb = (rgb: RGB) => {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
};

const luminance = ({ r, g, b }: RGB) => {
  var a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const contrast = (rgb: RGB, currentMode: "lightMode" | "darkMode") => {
  const backgroundRGB = currentMode === "lightMode" ? 255 : 12;
  var lum1 = luminance(rgb);
  var lum2 = luminance({
    r: backgroundRGB,
    g: backgroundRGB,
    b: backgroundRGB,
  });
  var brightest = Math.max(lum1, lum2);
  var darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

const ColorPickerModal = ({ closeModal }: Props) => {
  const [color, setColor] = useState<ColorState>({
    currentMode: "lightMode",
    lightMode: {
      r: 105,
      g: 67,
      b: 255,
    },
    darkMode: {
      r: 187,
      g: 134,
      b: 252,
    },
  });

  const isInvalid = contrast(color[color.currentMode], color.currentMode) < 4.5;

  return (
    <BaseModal
      closeModal={closeModal}
      className={styles.modal}
      style={{
        backgroundColor: `${
          color.currentMode === "lightMode" ? "#fff" : "#1a1a1a"
        }`,
      }}
    >
      <h2
        style={{ color: convertToRgb(color[color.currentMode]) }}
        className={styles.title}
      >
        Odaberite glavnu boju
      </h2>
      <div className={styles.contentBox}>
        <div className={styles.selectBox}>
          <Button
            onClick={() => {
              setColor((prev) => ({ ...prev, currentMode: "lightMode" }));
            }}
            className={`${styles.selectBtn} ${
              color.currentMode === "lightMode" && styles.selectBtn__selected
            }`}
            style={{ borderRadius: "8px 0 0 8px" }}
          >
            Svjetli način
          </Button>
          <Button
            onClick={() => {
              setColor((prev) => ({ ...prev, currentMode: "darkMode" }));
            }}
            className={`${styles.selectBtn} ${
              color.currentMode === "darkMode" && styles.selectBtn__selected
            }`}
            style={{ borderRadius: "0 8px 8px 0" }}
          >
            Tamni način
          </Button>
        </div>
        <RgbColorPicker
          className={styles.colorPicker}
          onChange={(newColor) => {
            setColor((prevColor) => {
              const newColorObj = { ...prevColor };
              newColorObj[prevColor.currentMode] = newColor;
              return newColorObj;
            });
          }}
          color={color[color.currentMode]}
        />
        {isInvalid && (
          <div className={styles.errorBox}>
            <AlertIcon className={styles.errorIcon} />
            <p>
              Ova boja nema dovoljno dobar kontrast s{" "}
              {color.currentMode === "lightMode" ? "bijelom" : "crnom"}{" "}
              pozadinom, molimo vas odaberite drugu boju s boljim kontrastom
            </p>
          </div>
        )}
      </div>
      <div>
        <Button
          className={styles.btn}
          style={{
            backgroundColor: convertToRgb(color[color.currentMode]),
            color: color.currentMode === "lightMode" ? "#fff" : "#1a1a1a",
          }}
          disabled={isInvalid}
        >
          Spremite
        </Button>
      </div>
    </BaseModal>
  );
};

export default ColorPickerModal;
