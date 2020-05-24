export const getYearDifference = (responseDate) => {
  const timeStamp = Date.parse(responseDate);
  const fetchDate = new Date(timeStamp);
  const currentDate = new Date();
  return currentDate.getFullYear() - fetchDate.getFullYear();
};
