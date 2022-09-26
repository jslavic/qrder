export const formatTwoDigits = (n: number) => {
  console.log(n < 10 ? (n === 0 ? "0" : "0" + n) : n);
  return n < 10 ? "0" + n : n;
};
