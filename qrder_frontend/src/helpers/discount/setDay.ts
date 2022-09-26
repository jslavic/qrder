export const setDay = (date: Date, dayToSet: number, weeksAhead = 0) =>
  date.getDate() + weeksAhead * 7 + (dayToSet - date.getDay());
