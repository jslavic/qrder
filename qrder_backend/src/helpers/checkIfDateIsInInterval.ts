export const checkIfDateIsInInterval = (
  start: Date,
  end: Date,
  comparisonDateTime: number,
) => {
  console.log('this one', new Date(comparisonDateTime).toUTCString());
  if (
    comparisonDateTime > start.getTime() &&
    comparisonDateTime < end.getTime()
  )
    return true;
  return false;
};
