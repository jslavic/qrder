/**
 * All repeated discount date arithmethic is done through a base date which is January 1st, 1978, 00:00:00,
 * in order to make it easier to determine weather certain discounts apply or not, this function makes base
 * date convertion and date arithmethic easier
 * @param options Option object which allows to set a future date instead of the default base date
 * @returns Date relative to the base date
 */
export const getDateFromBaseDate = (
  options: {
    minutesAhead?: number;
    hoursAhead?: number;
    daysAhead?: number;
    weeksAhead?: number;
    monthsAhead?: number;
  } = {},
) => {
  console.log('DAYS AHEAD', options.daysAhead);
  const days = (options.daysAhead || 0) + (options.weeksAhead || 0) * 7;
  return new Date(
    Date.UTC(
      1978,
      options.monthsAhead || 0,
      days || 1,
      options.hoursAhead || 0,
      options.minutesAhead || 0,
      0,
    ),
  );
};
