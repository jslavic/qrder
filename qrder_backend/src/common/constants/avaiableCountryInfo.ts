import Stripe from 'stripe';
import { AvailableCountries } from '../enum/availableCountries.enum';

export const availableCountryInfo: {
  [key in AvailableCountries]: {
    countryCode: string;
    currency: string;
    supportedAccountType: 'express' | 'custom';
    capabilities: Stripe.AccountCreateParams.Capabilities;
    timezoneOffset?: number;
    business_type?: Stripe.AccountCreateParams.BusinessType;
  };
} = {
  hr: {
    countryCode: 'hr',
    currency: 'HRK',
    supportedAccountType: 'custom',
    timezoneOffset: 120,
    capabilities: {
      card_payments: { requested: true },
      bank_transfer_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: 'individual',
  },
};
