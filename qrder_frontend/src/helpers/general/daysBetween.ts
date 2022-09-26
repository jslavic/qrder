const treatAsUTC = (date: Date) => {
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.getTime();
};

export const daysBetween = (startDate: Date, endDate: Date) => {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.ceil(
    (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay
  );
};
