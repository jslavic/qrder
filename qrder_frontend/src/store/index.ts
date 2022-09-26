import { configureStore } from "@reduxjs/toolkit";
import authReducer, { initialAuthState } from "./slices/auth.slice";
import currencyReducer, { initialCurrencyState } from "./slices/currency.slice";

const store = configureStore({
  reducer: { auth: authReducer, currency: currencyReducer },
});

export interface RootState {
  auth: typeof initialAuthState;
  currency: typeof initialCurrencyState;
}

export default store;
