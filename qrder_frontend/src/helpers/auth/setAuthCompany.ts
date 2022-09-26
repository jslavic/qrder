import { AnyAction, Dispatch } from "redux";
import Cookie from "js-cookie";
import { URL } from "../../constants/config/url";
import { CompanyLoginDto } from "../../constants/dto/company/login.dto";
import { authActions } from "../../store/slices/auth.slice";

export const setAuthCompany = async (dispatch: Dispatch<AnyAction>) => {
  const loginResponse = await fetch(`${URL}/company-authentication`, {
    method: "GET",
    credentials: "include",
  });
  if (!loginResponse.ok) return Cookie.remove("AuthType");

  const companyData = (await loginResponse.json()) as CompanyLoginDto;
  dispatch(authActions.companyLogin(companyData));
  return;
};
