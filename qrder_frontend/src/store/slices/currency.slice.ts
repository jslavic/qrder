import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const initialCurrencyState: {
  currency?: string;
} = {};

const currencySlice = createSlice({
  name: "currency",
  initialState: initialCurrencyState,
  reducers: {
    setCurrency(state, action: PayloadAction<string>) {
      state.currency = action.payload;
    },
  },
});

export const currencyActions = currencySlice.actions;
const currencyReducer = currencySlice.reducer;

export default currencyReducer;
