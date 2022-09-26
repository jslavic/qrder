import { PreselectedPlans } from "../enums/auth.enums";

type ValidSubscriptionPlans = {
  [key in PreselectedPlans]: number;
};

export const SUBSCRIPTION_PLAN_PRICING: ValidSubscriptionPlans = {
  STANDARD: 110,
  PREMIUM: 310,
};
