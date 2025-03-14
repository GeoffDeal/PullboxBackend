export function calcSunday(date) {
  date += "T00:00:00";
  const dateObject = new Date(date);
  dateObject.setDate(dateObject.getDate() - dateObject.getDay());
  dateObject.setHours(0, 0, 0, 0);
  const sundayString = dateObject.toLocaleDateString("en-CA");
  return sundayString;
}

export function calcWeekEnd(date) {
  date += "T00:00:00";
  const weekEnd = new Date(date);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekEndString = weekEnd.toLocaleDateString("en-CA");
  return weekEndString;
}
