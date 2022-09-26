import { AnyAction, Dispatch } from "redux";
import Cookie from "js-cookie";
import { URL } from "../../constants/config/url";
import { UserLoginDto } from "../../constants/dto/user/login.dto";
import { authActions } from "../../store/slices/auth.slice";

export const setAuthUser = async (dispatch: Dispatch<AnyAction>) => {
  const loginResponse = await fetch(`${URL}/user-authentication`, {
    method: "GET",
    credentials: "include",
  });
  if (!loginResponse.ok) return Cookie.remove("AuthType");

  const userData = (await loginResponse.json()) as UserLoginDto;
  dispatch(authActions.userLogin(userData));
  return;
};
