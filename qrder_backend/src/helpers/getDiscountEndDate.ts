import { RepeatedDiscount } from 'src/discount/enum/repeatedDiscount.enum';
import { getDateFromTimezoneOffset } from './getDateFromTimezoneOffset';

export const formatTwoDigits = (n: number) => {
  return n < 10 ? '0' + n : n;
};

export const getDayFromDayNumber = (dayNumber: number) => {
  switch (dayNumber) {
    case 1:
      return 'Pon';
    case 2:
      return 'Uto';
    case 3:
      return 'Sri';
    case 4:
      return 'Čet';
    case 5:
      return 'Pet';
    case 6:
      return 'Sub';
    case 0:
      return 'Ned';
    default:
      return 'Nepoznato';
  }
};

export const getDiscountEndDate = (
  to: Date,
  repeated: RepeatedDiscount,
  timezoneOffset: number,
) => {
  const currentDate = getDateFromTimezoneOffset(timezoneOffset);
  switch (repeated) {
    case RepeatedDiscount.DAILY:
    case RepeatedDiscount.SPECIFIC_DAYS:
      return `${formatTwoDigits(to.getHours())}:${formatTwoDigits(
        to.getMinutes(),
      )}`;
    case RepeatedDiscount.WEEKLY:
      return `${getDayFromDayNumber(to.getDay())} ${formatTwoDigits(
        to.getHours(),
      )}:${formatTwoDigits(to.getMinutes())}`;
    case RepeatedDiscount.MONTHLY:
      return `${to.getDate()}.${currentDate.getMonth() + 1}.${
        Math.abs(currentDate.getDate() - to.getDate()) > 2
          ? ''
          : ` ${formatTwoDigits(to.getHours())}:${formatTwoDigits(
              to.getMinutes(),
            )}`
      } `.trimEnd();
    case RepeatedDiscount.NOT_REPEATED:
      return `${to.getDate()}.${
        to.getMonth() + 1
      }.${to.getFullYear()}. ${formatTwoDigits(
        to.getHours(),
      )}:${formatTwoDigits(to.getMinutes())}`;
  }
};
