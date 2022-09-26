import { RepeatedDays } from "../../constants/enums/discountEnums/repeatedDays.enum";
import { RepeatedDiscount } from "../../constants/enums/discountEnums/repeatedDiscount";
import { formatTwoDigits } from "../general/formatTwoDigits";
import { getDayFromDayNumber } from "./getDayFromDayNumber";

export const getDiscountDate = (repeated: RepeatedDiscount, date: Date) => {
  switch (repeated) {
    case RepeatedDiscount.DAILY:
    case RepeatedDiscount.SPECIFIC_DAYS:
      return `${formatTwoDigits(date.getUTCHours())}:${formatTwoDigits(
        date.getUTCMinutes()
      )}`;
    case RepeatedDiscount.WEEKLY:
      return `${getDayFromDayNumber(
        date.getUTCDay() || RepeatedDays.MON
      )} ${formatTwoDigits(date.getUTCHours())}:${formatTwoDigits(
        date.getUTCMinutes()
      )}`;
    case RepeatedDiscount.MONTHLY:
      console.log(date);
      return `${date.getUTCDate()}. u mjesecu, ${formatTwoDigits(
        date.getUTCHours()
      )}:${formatTwoDigits(date.getUTCMinutes())}`;
    case RepeatedDiscount.NOT_REPEATED:
      return `${date.getUTCDate()}.${date.getUTCMonth()}.${date.getUTCFullYear()}, ${formatTwoDigits(
        date.getUTCHours()
      )}:${formatTwoDigits(date.getUTCMinutes())}`;
  }
};
