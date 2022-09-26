import { formatTwoDigits } from "./formatTwoDigits";

export const convertToISODate = (date: Date) => {
  return `${date.getFullYear()}-${formatTwoDigits(
    date.getMonth() + 1
  )}-${formatTwoDigits(date.getDate())}`;
};
