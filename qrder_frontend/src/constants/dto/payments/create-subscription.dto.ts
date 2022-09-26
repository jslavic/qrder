export interface CreateSubscriptionDto {
  subscription: {
    status: "active" | "incomplete";
    latest_invoice: { payment_intent: { client_secret: string } };
  };
}
