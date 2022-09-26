export const formatPrice = (price: number) => {
  return price
    .toFixed(2)
    .replace(".", ",")
    .replace(/\d(?=(\d{3})+,)/g, "$&.");
};
