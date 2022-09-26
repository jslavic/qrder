type BalanceData = {
  available: { amount: number; currency: string }[];
  pending: { amount: number; currency: string }[];
};

export const getCurrentBalanceArray = (balanceData: BalanceData) => {
  return balanceData.available
    .map((availableBalanceItem) => {
      const amount =
        availableBalanceItem.amount +
        (balanceData.pending.find(
          (pendingBalanceItem) =>
            pendingBalanceItem.currency === availableBalanceItem.currency
        )?.amount || 0);
      return { amount, currency: availableBalanceItem.currency };
    })
    .sort((a, b) => b.amount - a.amount);
};
