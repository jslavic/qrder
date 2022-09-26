import { formatTwoDigits } from "./formatTwoDigits";

export const dayOfYearToString = (day: number) => {
  const date = new Date(new Date().getFullYear(), 0, day);
  if (day === 181) console.log(date);
  return `${formatTwoDigits(date.getDate())}/${formatTwoDigits(
    date.getMonth() + 1
  )}/${date.getFullYear()}`;
};
