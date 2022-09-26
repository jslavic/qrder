/**
 * @param timezoneOffset Value that is the negated Date.getTimezoneOffset() number
 * @param time A getTime() value from a date, if not provided current time will be used
 */
export const getDateFromTimezoneOffset = (
  timezoneOffset: number,
  time?: number,
) => {
  return new Date((time || new Date().getTime()) - timezoneOffset * 60000);
};
