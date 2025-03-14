export function calcSunday(date) {
  const dateObject = new Date(date);
  dateObject.setDate(dateObject.getDate() - dateObject.getDay());
  dateObject.setHours(0, 0, 0, 0);
  const sundayString = dateObject.toLocaleDateString("en-CA");
  return sundayString;
}
