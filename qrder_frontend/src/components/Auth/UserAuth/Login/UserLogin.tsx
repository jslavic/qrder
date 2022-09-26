import React, { useEffect, useState } from "react";
import Form from "../../../Form/Form";
import InputSection from "../../../Form/InputSection/InputSection";
import { Link } from "react-router-dom";
import FormButton from "../../../Common/Buttons/FormButton/FormButton";
import ErrorBox from "../../../Error/ErrorBox/ErrorBox";
import { URL } from "../../../../constants/config/url";
import { useDispatch } from "react-redux";
import { authActions } from "../../../../store/slices/auth.slice";

import styles from "./UserLogin.module.css";
import commonStyles from "../../Common.module.css";
import generalStyles from "../../../../styles/general.module.css";
import { UserLoginDto } from "../../../../constants/dto/user/login.dto";
import useFetch from "../../../../hooks/useFetch";

type Props = {};

const loginUrl = `${URL}/user-authentication/login`;

const UserLogin = (props: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const { state: fetchState, doFetch } = useFetch<UserLoginDto>(loginUrl);

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (email.trim() === "" || password.trim() === "") {
      setError(true);
      return;
    }

    doFetch({
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
  };

  useEffect(() => {
    if (fetchState.data) dispatch(authActions.userLogin(fetchState.data));
  }, [fetchState.data, dispatch]);

  return (
    <section className={commonStyles.section}>
      <Form
        title={
          <span>
            Prijava <span className={generalStyles.highlight}>Korisnika</span>
          </span>
        }
        desc={"Prijavite se na vaš korisnički račun"}
        onSubmit={handleSubmit}
      >
        {(error || fetchState.error) && (
          <div className={styles.errorBox}>
            <ErrorBox>Molimo vas unesite točne podatke</ErrorBox>
          </div>
        )}

        <div className={styles.inputSections}>
          <InputSection
            state={email}
            label={"Email"}
            type={"email"}
            name={"email"}
            placeholder={"Email adresa vašeg registriranog računa"}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            onBlur={() => {}}
          />
          <InputSection
            state={password}
            label={"Lozinka"}
            type={"password"}
            name={"password"}
            placeholder={"Lozinka"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            onBlur={() => {}}
          />
          <div className={styles.extras}>
            <div className={styles.extraSection}>
              <Link
                to={"/user/forgot-password"}
                className={styles.forgotPassword}
              >
                Zaboravljena lozinka?
              </Link>
            </div>
          </div>
        </div>
        <FormButton>Prijava</FormButton>
        <div className={styles.endBox}>
          <Link className={styles.link} to={"/user/register"}>
            Niste registrirani kupac? Registrirajte se
          </Link>
        </div>
      </Form>
    </section>
  );
};

export default UserLogin;
