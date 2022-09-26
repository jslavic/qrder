import { RepeatedDays } from "../../constants/enums/discountEnums/repeatedDays.enum";

/**
 * @param repeatedDay Param can also be viewed as a integer in range 0-6 (0 representing sunday, 6 representing saturday)
 */
export const getDayFromDayNumber = (repeatedDay: RepeatedDays) => {
  switch (repeatedDay) {
    case RepeatedDays.MON:
      return "Pon";
    case RepeatedDays.TUE:
      return "Uto";
    case RepeatedDays.WED:
      return "Sri";
    case RepeatedDays.THU:
      return "Čet";
    case RepeatedDays.FRI:
      return "Pet";
    case RepeatedDays.SAT:
      return "Sub";
    case RepeatedDays.SUN:
      return "Ned";
  }
};
