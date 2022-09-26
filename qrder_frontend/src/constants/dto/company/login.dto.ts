import { StripeVerificationStatus } from "../../enums/stripeVerificationStatus.enum";

export interface CompanyLoginDto {
  customerId: string;
  email: string;
  isSubscriptionActive: true;
  name: string;
  verificationStatus: StripeVerificationStatus;
  submittedFirstVerification: boolean;
  addedBankAccount: boolean;
  currency: string;
  subscriptionEnds: string;
  subscriptionPlan: string;
}
