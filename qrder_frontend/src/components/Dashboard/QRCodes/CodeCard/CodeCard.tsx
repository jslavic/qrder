import React, { useEffect, useRef, useState } from "react";
import Button from "../../../Common/Buttons/Button/Button";
import QRCodeStyling, {
  CornerDotType,
  CornerSquareType,
  DotType,
  DrawType,
  Options,
} from "qr-code-styling";

import { ReactComponent as DeleteIcon } from "../../../../assets/delete.svg";
import { ReactComponent as EditIcon } from "../../../../assets/edit-product.svg";

import styles from "./CodeCard.module.css";
import { URL } from "../../../../constants/config/url";
import { QrDataDto } from "../../../../constants/dto/qrCodes/qrData.dto";

type ModalState = {
  type: false | "ADD" | "EDIT" | "DELETE";
  item: QrDataDto | undefined;
};

type Props = {
  qrData: QrDataDto;
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
};

const CodeCard = ({ qrData, setModalState }: Props) => {
  console.log(qrData.path);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [options, _setOptions] = useState<Options>({
    width: 250,
    height: 250,
    type: "svg" as DrawType,
    data: `${URL}/order/${qrData.path}`,
    image: "/logo.png",
    margin: 4,
    dotsOptions: {
      color: "#101012",
      type: "rounded" as DotType,
    },
    backgroundOptions: {
      color: "#fff",
    },
    cornersSquareOptions: {
      color: "#6943ff",
      type: "extra-rounded" as CornerSquareType,
    },
    cornersDotOptions: {
      color: "#6943ff",
      type: "dot" as CornerDotType,
    },
    imageOptions: {
      margin: 2,
    },
  });
  const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling(options));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      qrCode.append(ref.current);
    }
  }, [qrCode, ref]);

  return (
    <div className={styles.card}>
      <p className={styles.title}>{qrData.table.name}</p>
      <div className={styles.qrCode}>
        <div ref={ref} />
      </div>
      <div className={styles.buttons}>
        <Button
          className={styles.btn__edit}
          onClick={() => {
            setModalState({ type: "EDIT", item: qrData });
          }}
        >
          <EditIcon />
        </Button>
        <Button
          className={styles.btn__delete}
          onClick={() => {
            setModalState({ type: "DELETE", item: qrData });
          }}
        >
          <DeleteIcon />
        </Button>
      </div>
    </div>
  );
};

export default CodeCard;
