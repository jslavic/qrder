export const getDayOfYear = (date = new Date()) => {
  console.log(date);
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.ceil(diff / oneDay);
};
