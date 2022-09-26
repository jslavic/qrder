import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CompanyLoginDto } from "../../constants/dto/company/login.dto";
import { UserLoginDto } from "../../constants/dto/user/login.dto";
import { StripeVerificationStatus } from "../../constants/enums/stripeVerificationStatus.enum";

export type User = { name: string; email: string };
export type Company = {
  customerId: string;
  email: string;
  isSubscriptionActive: boolean;
  name: string;
  verificationStatus: StripeVerificationStatus;
  submittedFirstVerification: boolean;
  addedBankAccount: boolean;
  currency: string;
  subscriptionEnds: string;
  subscriptionPlan: string;
};

export const initialAuthState: {
  isLoading: boolean;
  user?: User;
  company?: Company;
} = {
  isLoading: true,
  user: undefined,
  company: undefined,
};

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    companyLogin(state, action: PayloadAction<CompanyLoginDto>) {
      state.company = action.payload;
    },
    userLogin(state, action: PayloadAction<UserLoginDto>) {
      state.user = action.payload;
    },
    logout(state) {
      state.company = undefined;
      state.user = undefined;
    },
    stopLoading(state) {
      state.isLoading = false;
    },
  },
});

export const authActions = authSlice.actions;
const authReducer = authSlice.reducer;

export default authReducer;
