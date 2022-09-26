/**
 * Get a date that will be a certain number of days in the future from now
 * @param numberOfDays Amount of days ahead of now you would like to set a date for
 * @param startDate If you don't want the date to begin from right now, you can provide start date (in miliseconds) in order to specify the date from which you want the count to start
 * @returns Date that is ahead of today by the set amount of days
 */
export const getDateByDays = (numberOfDays: number, startDate = Date.now()) => {
  return new Date(
    startDate +
      1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * numberOfDays,
  );
};
