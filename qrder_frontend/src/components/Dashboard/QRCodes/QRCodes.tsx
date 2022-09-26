import React, { useEffect, useState } from "react";
import { URL } from "../../../constants/config/url";
import { QrDataDto } from "../../../constants/dto/qrCodes/qrData.dto";
import useFetch from "../../../hooks/useFetch";
import Button from "../../Common/Buttons/Button/Button";
import ErrorSection from "../DashboardCommon/ErrorSection";
import LoadingSection from "../DashboardCommon/LoadingSection";
import CodeCard from "./CodeCard/CodeCard";
import DeleteTableModal from "./DeleteTableModal/DeleteTableModal";

import styles from "./QRCodes.module.css";
import TableModal from "./TableModal/TableModal";

type Props = {};

type ModalState = {
  type: false | "ADD" | "EDIT" | "DELETE";
  item: QrDataDto | undefined;
};

const tableUrl = `${URL}/table`;

const QRCodes = (props: Props) => {
  const [qrData, setQrData] = useState<QrDataDto[]>([]);
  const [modalState, setModalState] = useState<ModalState>({
    type: false,
    item: undefined,
  });

  const { state: fetchState, doFetch } = useFetch<QrDataDto[]>(tableUrl);

  useEffect(() => {
    doFetch({ method: "GET", credentials: "include" });
  }, [doFetch]);

  useEffect(() => {
    if (fetchState.data) setQrData(fetchState.data);
  }, [fetchState.data]);

  console.log(qrData);

  if (fetchState.error)
    return (
      <ErrorSection
        handleFormReload={() =>
          doFetch({ method: "GET", credentials: "include" })
        }
      />
    );

  if (fetchState.isLoading) return <LoadingSection />;

  if (fetchState.data)
    return (
      <>
        {modalState.type === "ADD" && (
          <TableModal
            setQrData={setQrData}
            closeModal={() => setModalState({ type: false, item: undefined })}
          />
        )}
        {modalState.type === "EDIT" && (
          <TableModal
            qrData={modalState.item}
            setQrData={setQrData}
            closeModal={() => setModalState({ type: false, item: undefined })}
          />
        )}
        {modalState.type === "DELETE" && (
          <DeleteTableModal
            qrData={modalState.item!}
            setQrData={setQrData}
            closeModal={() => setModalState({ type: false, item: undefined })}
          />
        )}
        <div className={styles.mainBox}>
          <div className={styles.contentBox}>
            <div className={styles.titleBox}>
              <h2 className={styles.title}>Vaši QR Kodovi</h2>
              <div className={styles.titleButtons}>
                <Button
                  className={styles.btn}
                  onClick={() =>
                    setModalState({ type: "ADD", item: undefined })
                  }
                >
                  Novi QR Kod
                </Button>
              </div>
            </div>
            <div className={styles.qrCodes}>
              {qrData.length > 0 &&
                qrData.map((qrData) => (
                  <CodeCard qrData={qrData} setModalState={setModalState} />
                ))}
            </div>
          </div>
        </div>
      </>
    );

  return <LoadingSection />;
};

export default QRCodes;
