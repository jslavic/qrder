import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Switch from "react-switch";
import { StripeVerificationStatus } from "../../../constants/enums/stripeVerificationStatus.enum";
import { RootState } from "../../../store";
import AdditionalInfoModal from "./AdditionalInfoModal/AdditionalInfoModal";
import BankAccountModal from "./BankAccountModal/BankAccountModal";
import ConfirmIdentityModal from "./ConfirmIdentityModal/ConfirmIdentityModal";
import IdentityStatusTag from "./IdentityStatusTag/IdentityStatusTag";

import styles from "./Settings.module.css";
import ColorPickerModal from "./ColorPickerModal/ColorPickerModal";
import CompanyNameModal from "./CompanyNameModal/CompanyNameModal";
import { URL } from "../../../constants/config/url";
import useFetch from "../../../hooks/useFetch";
import { formatPrice } from "../../../helpers/general/formatPrice";
import CardIcon from "./CardIcon/CardIcon";
import Button from "../../Common/Buttons/Button/Button";
import CancelSubscriptionModal from "./SubscriptionStatusModal/SubscriptionStatusModal";
import ChangeSubscriptionPaymentModal from "./ChangeSubscriptionPaymentModal/ChangeSubscriptionPaymentModal";
import ErrorBox from "../../Error/ErrorBox/ErrorBox";
import NewSubscriptionModal from "./NewSubscriptionModal/NewSubscriptionModal";
import LoadingSection from "../DashboardCommon/LoadingSection";
import ErrorSection from "../DashboardCommon/ErrorSection";
import FetchError from "../../Error/ErrorSection/FetchError";
import LoadingSpinner from "../../Common/LoadingSpinner/LoadingSpinner";

type Props = {};

export type CardData = {
  brand: string;
  exp_month: number;
  exp_year: number;
  last4: string;
};

export type SubscriptionData = {
  cancel_at_period_end: boolean;
  current_period_end: number;
  plan: { amount: number; currency: string };
  paymentDate: Date;
};

type FetchData =
  | {
      paymentMethod: {
        card: CardData;
      };
      subscription: SubscriptionData;
    }
  | { subscription: null };

const subscriptionUrl = `${URL}/subscription`;

const Settings = (props: Props) => {
  const { state: subscriptionInfo, doFetch } =
    useFetch<FetchData>(subscriptionUrl);

  const { company } = useSelector((state: RootState) => state.auth);

  const [cardData, setCardData] = useState<CardData | null>(null);
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);

  const [cardPayment, setCardPayment] = useState(false);
  const [confirmIdentityModal, setConfirmIdentityModal] = useState(false);
  const [bankAccountModal, setBankAccountModal] = useState(false);
  const [nameModal, setNameModal] = useState(false);
  const [colorPicker, setColorPicker] = useState(false);
  const [changeSubscription, setChangeSubscription] = useState(false);
  const [changeSubscriptionPayment, setChangeSubscriptionPayment] =
    useState(false);
  const [newSubscription, setNewSubscription] = useState(false);

  useEffect(() => {
    doFetch({ method: "GET", credentials: "include" });
  }, [doFetch]);

  useEffect(() => {
    if (!subscriptionInfo.data) return;
    if (subscriptionInfo.data.subscription === null) {
      return;
    } else {
      const paymentDate = new Date(
        subscriptionInfo.data.subscription.current_period_end * 1000
      );
      setCardData(subscriptionInfo.data.paymentMethod.card);
      setSubscriptionData({
        ...subscriptionInfo.data.subscription,
        paymentDate,
      });
    }
  }, [subscriptionInfo]);

  return (
    <>
      {nameModal && <CompanyNameModal closeModal={() => setNameModal(false)} />}
      {colorPicker && (
        <ColorPickerModal
          closeModal={() => {
            setColorPicker(false);
          }}
        />
      )}
      {changeSubscription && (
        <CancelSubscriptionModal
          isActive={!subscriptionData?.cancel_at_period_end}
          closeModal={() => setChangeSubscription(false)}
          setSubscriptionData={setSubscriptionData}
          subscriptionPlan={company!.subscriptionPlan}
        />
      )}
      {changeSubscriptionPayment && (
        <ChangeSubscriptionPaymentModal
          closeModal={() => setChangeSubscriptionPayment(false)}
          setCardData={setCardData}
        />
      )}
      {newSubscription && (
        <NewSubscriptionModal
          closeModal={() => setNewSubscription(false)}
          setCardData={setCardData}
        />
      )}
      {confirmIdentityModal &&
        (company!.submittedFirstVerification ? (
          <ConfirmIdentityModal
            setConfirmIdentityModal={setConfirmIdentityModal}
          />
        ) : (
          <AdditionalInfoModal
            setConfirmIdentityModal={setConfirmIdentityModal}
          />
        ))}
      {bankAccountModal && (
        <BankAccountModal setBankAccountModal={setBankAccountModal} />
      )}
      <div className={styles.mainBox}>
        <div className={styles.titleBox}>
          <h2 className={styles.title}>Postavke</h2>
        </div>
        <div className={styles.contentBox}>
          <div className={styles.subtitleBox}>
            <h3 className={styles.subtitle}>Pla??anja</h3>
          </div>
          <div className={styles.settingsBox}>
            <div className={styles.settingsSection}>
              <div className={styles.setting}>
                <p className={styles.settingsText}>Valuta</p>
                <p className={styles.settingsDesc}>
                  Valuta koja ??e se prikazati uz cijenu va??ih proizvoda te kojom
                  ??e pla??ati va??i korisnici
                </p>
              </div>
              <div>
                <select
                  name="currency"
                  id="currency"
                  className={styles.settingsSelect}
                >
                  <option value="HRK">kn</option>
                  <option value="EUR">???</option>
                </select>
              </div>
            </div>
            <div className={styles.settingsSection}>
              <div className={styles.setting}>
                <p className={styles.settingsText}>Pla??anje karticom</p>
                <p className={styles.settingsDesc}>
                  Omogu??ite va??im gostima da pla??aju karticom pri naru??ivanju
                  (za ovu postavku morate prvo potvrditi identiet vlasnika
                  kompanije i dodati bankovni ra??un), pri svakoj transakciji
                  Stripe uzima 2kn + 2%
                </p>
              </div>
              <Switch
                checked={cardPayment}
                onChange={() => setCardPayment((prev) => !prev)}
                onColor="#d9cfff"
                onHandleColor="#6836f4"
                handleDiameter={25}
                uncheckedIcon={false}
                checkedIcon={false}
                className={
                  company!.verificationStatus !==
                  StripeVerificationStatus.VERFIFIED
                    ? styles.disabledSwitch
                    : undefined
                }
                boxShadow="0px 0px 2px var(--black-high-opacity)"
                activeBoxShadow="0px 0px 0px 10px var(--black-mid-opacity)"
                disabled={
                  company!.verificationStatus !==
                  StripeVerificationStatus.VERFIFIED
                }
                height={20}
                width={48}
              />
            </div>
            <div className={styles.settingsSection}>
              <div className={styles.setting}>
                <p className={styles.settingsText}>
                  Potvrdite identitet vlasnika{" "}
                  <IdentityStatusTag status={company!.verificationStatus} />
                </p>
                <p className={styles.settingsDesc}>
                  Pru??ite potrebne informacije i dokumente koje Stripe zahtijeva
                  kako biste mogli omogu??iti pla??anje karticom (
                  <i>
                    napomena: ove informacije Qrder ne??e zadr??avati za sebe nego
                    ih izravno proslijediti Stripeu
                  </i>
                  )
                </p>
              </div>
              <div>
                <button
                  disabled={
                    company!.verificationStatus ===
                    StripeVerificationStatus.VERFIFIED
                  }
                  className={styles.settingsBtn}
                  onClick={() => setConfirmIdentityModal(true)}
                >
                  {company!.verificationStatus ===
                  StripeVerificationStatus.VERFIFIED
                    ? "Potvr??eno"
                    : "Potvrdite"}
                </button>
              </div>
            </div>
            {company!.verificationStatus ===
              StripeVerificationStatus.VERFIFIED && (
              <div className={styles.settingsSection}>
                <div className={styles.setting}>
                  <p className={styles.settingsText}>Dodajte bankovni ra??un</p>
                  <p className={styles.settingsDesc}>
                    Na ovaj bankovni ra??un ??e Qrder slati novac svakoga puta
                    kada odlu??ite podi??i novac
                  </p>
                </div>
                <div>
                  <button
                    className={styles.settingsBtn}
                    onClick={() => setBankAccountModal(true)}
                  >
                    Dodajte ra??un
                  </button>
                </div>
              </div>
            )}
            {company!.verificationStatus ===
              StripeVerificationStatus.VERFIFIED && (
              <div className={styles.settingsSection}>
                <div className={styles.setting}>
                  <p className={styles.settingsText}>
                    Automatsko podizanje novca
                  </p>
                  <p className={styles.settingsDesc}>
                    Ukoliko ??elite da vam Qrder automatski u odre??enim
                    intervalima ??alje novac, to mo??ete omogu??iti ovom postavkom
                    (
                    <i>
                      i dalje ??ete mo??i samostalno podi??i novac ukoliko to
                      zatrebate
                    </i>
                    )
                  </p>
                </div>
                <div>
                  <select
                    name="payouts"
                    id="payouts"
                    className={styles.settingsSelect}
                  >
                    <option value="daily">Dnevno</option>
                    <option value="weekly">Tjedno</option>
                    <option value="monthly">Mjese??no</option>
                    <option value="weekly">Samostalno</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.contentBox}>
          <div className={styles.subtitleBox}>
            <h3 className={styles.subtitle}>Kompanija</h3>
          </div>
          <div className={styles.settingsBox}>
            <div className={styles.settingsSection}>
              <div className={styles.setting}>
                <p className={styles.settingsText}>Ime kompanije</p>
                <p className={styles.settingsDesc}>
                  Ime koje ??e se prikazati va??im kupcima tijekom naru??ivanja
                  (trenutno: <strong>Qrder</strong>)
                </p>
              </div>
              <div>
                <button
                  className={styles.settingsBtn}
                  onClick={() => setNameModal(true)}
                >
                  Uredi
                </button>
              </div>
            </div>
            <div className={styles.settingsSection}>
              <div className={styles.setting}>
                <p className={styles.settingsText}>Primarna boja</p>
                <p className={styles.settingsDesc}>
                  Ovom opcijom mo??ete zamijeniti zadanu <i>Qrder ljubi??astu</i>{" "}
                  te sami odrediti koja ??e se boja pokazati umjesto nje (boju
                  tako??er mo??ete prilagoditi ovisno o tome koriste li va??i
                  korisnici tamni na??in rada na svojem ure??aju ili ne)
                </p>
              </div>
              <div style={{ position: "relative" }}>
                <button
                  className={styles.settingsBtn}
                  onClick={() => setColorPicker((prev) => !prev)}
                >
                  Odaberite
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.contentBox}>
          <div className={styles.subtitleBox}>
            <h3 className={styles.subtitle}>Va??a Pretplata</h3>
          </div>
          <div className={styles.settingsBox}>
            {subscriptionInfo.isLoading && <LoadingSpinner size={50} />}
            {subscriptionInfo.error && (
              <FetchError
                handleFormReload={() =>
                  doFetch({ method: "GET", credentials: "include" })
                }
              />
            )}
            {(!cardData || !subscriptionData) &&
              !subscriptionInfo.error &&
              !subscriptionInfo.isLoading && (
                <div>
                  <div
                    className={`${styles.subscriptionCard} ${styles.subscriptionCard__notActive}`}
                  >
                    <div className={styles.subscriptionTitle}>
                      Trenutna pretplata:{" "}
                      <span className={styles.subscriptionPlan}>
                        Niste pretpla??eni
                      </span>
                    </div>
                  </div>
                  <div className={styles.newSubscriptionBox}>
                    <Button
                      className={`${styles.btn} ${styles.btn__newSubscription}`}
                      onClick={() => setNewSubscription(true)}
                    >
                      Zapo??nite novu pretplatu
                    </Button>
                  </div>
                </div>
              )}
            {cardData &&
              subscriptionData &&
              !subscriptionInfo.error &&
              !subscriptionInfo.isLoading && (
                <div className={styles.subscriptionCard}>
                  <div className={styles.subscriptionTitle}>
                    Trenutna pretplata:{" "}
                    <span className={styles.subscriptionPlan}>
                      {company!.subscriptionPlan.toLowerCase()}
                    </span>
                  </div>
                  <div className={styles.subscriptionContent}>
                    <div className={styles.subscriptionPaymentBox}>
                      <div className={styles.subscriptionNextPayment}>
                        <p className={styles.subscriptionSubtitle}>
                          Slijede??e pla??anje
                        </p>
                        {subscriptionData.cancel_at_period_end ? (
                          <p>
                            Pretplata je{" "}
                            <span className={styles.highlighted}>otkazana</span>{" "}
                            te zavr??ava{" "}
                            <span className={styles.highlighted}>
                              {subscriptionData.paymentDate.getDate()}.
                              {subscriptionData.paymentDate.getMonth()}.
                              {subscriptionData.paymentDate.getFullYear()}.
                            </span>
                          </p>
                        ) : (
                          <p>
                            Pla??anje od{" "}
                            <span className={styles.highlighted}>
                              {formatPrice(
                                (subscriptionData.plan.amount || 0) / 100
                              )}{" "}
                              {subscriptionData.plan.currency.toUpperCase()}
                            </span>{" "}
                            dolazi{" "}
                            <span className={styles.highlighted}>
                              {subscriptionData.paymentDate.getDate()}.
                              {subscriptionData.paymentDate.getMonth()}.
                              {subscriptionData.paymentDate.getFullYear()}.
                            </span>
                          </p>
                        )}
                      </div>
                      <div className={styles.subscriptionCardInfo}>
                        <div className={styles.subscriptionCardIconBox}>
                          <CardIcon brand={cardData.brand} />
                        </div>
                        <div>
                          <p className={styles.subscriptionCardLastFour}>
                            <span className={styles.subscriptionCardBrand}>
                              {cardData.brand}
                            </span>{" "}
                            zavr??ava na{" "}
                            <span className={styles.highlighted}>
                              {cardData.last4}
                            </span>
                          </p>
                          <p className={styles.subscriptionCardExpiry}>
                            Isti??e:{" "}
                            {cardData.exp_month > 10
                              ? cardData.exp_month
                              : "0" + cardData.exp_month}
                            /{cardData.exp_year}
                          </p>
                        </div>
                        <button
                          className={styles.subscriptionCardEdit}
                          onClick={() => setChangeSubscriptionPayment(true)}
                        >
                          A??uriraj
                        </button>
                      </div>
                    </div>
                    <div className={styles.btnBox}>
                      <Button
                        className={`${styles.btn} ${styles.btn__changeSubscription}`}
                      >
                        Promijenite pretplatu
                      </Button>
                      {subscriptionData.cancel_at_period_end ? (
                        <Button
                          className={`${styles.btn} ${styles.btn__startSubscription}`}
                          onClick={() => setChangeSubscription(true)}
                        >
                          Obnovite pretplatu
                        </Button>
                      ) : (
                        <Button
                          className={`${styles.btn} ${styles.btn__cancelSubscription}`}
                          onClick={() => setChangeSubscription(true)}
                        >
                          Otka??ite pretplatu
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
