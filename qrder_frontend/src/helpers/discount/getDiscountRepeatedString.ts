import { RepeatedDays } from "../../constants/enums/discountEnums/repeatedDays.enum";
import { RepeatedDiscount } from "../../constants/enums/discountEnums/repeatedDiscount";
import { getDayFromDayNumber } from "./getDayFromDayNumber";

export const getDiscountRepeatedString = (
  repeated: RepeatedDiscount,
  repeatedDays?: RepeatedDays[]
) => {
  switch (repeated) {
    case RepeatedDiscount.NOT_REPEATED:
      return "Ne ponavlja se";
    case RepeatedDiscount.DAILY:
      return "Svakog dana";
    case RepeatedDiscount.SPECIFIC_DAYS:
      const stringifiedRepeatedDays = repeatedDays!.map((repeatedDay) =>
        getDayFromDayNumber(repeatedDay)
      );
      return stringifiedRepeatedDays.join(", ");
    case RepeatedDiscount.WEEKLY:
      return "Tjedno";
    case RepeatedDiscount.MONTHLY:
      return "Mjesečno";
  }
};
