import { RepeatedDays } from "../../constants/enums/discountEnums/repeatedDays.enum";
export const getRepeatedDayFromNumber = (day: number) => {
  switch (day) {
    case 0:
      return RepeatedDays.SUN;
    case 1:
      return RepeatedDays.MON;
    case 2:
      return RepeatedDays.TUE;
    case 3:
      return RepeatedDays.WED;
    case 4:
      return RepeatedDays.THU;
    case 5:
      return RepeatedDays.FRI;
    case 6:
      return RepeatedDays.SAT;
  }
  return RepeatedDays.MON;
};
