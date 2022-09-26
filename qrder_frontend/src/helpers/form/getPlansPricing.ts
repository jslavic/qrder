import { SUBSCRIPTION_PLAN_PRICING } from "../../constants/config/subscriptionPlanPricing";
import { PreselectedPlans } from "../../constants/enums/auth.enums";

export const getPlansPricing = (selectedPlan: PreselectedPlans) => {
  return SUBSCRIPTION_PLAN_PRICING[selectedPlan];
};
