/**
 * This funtion will keep the values of the current time provided while editing
 * the values that will be provided in the options object
 * @param currentTime Current time relative to the company timezone
 * @param options Options object which will set the provided future date values
 * @returns Date that contains the provided values
 */
export const getDateFromProvidedValues = (
  currentTime: Date,
  options: {
    minute?: number;
    hour?: number;
    day?: number;
    week?: number;
    month?: number;
  },
) => {
  return new Date(
    `${options.month || currentTime.getMonth() + 1}. ${
      options.day || currentTime.getDate()
    }. ${currentTime.getFullYear()}. ${options.hour || 0}:${
      options.minute || 0
    }:00`,
  );
};
