import { calcSunday, calcWeekEnd } from "./timeFunctions.js";

test("determines the Sunday the begins the week", () => {
  expect(calcSunday("2025-05-13")).toBe("2025-05-11");
});

test("should stay same day is already a Sunday", () => {
  expect(calcSunday("2025-05-11")).toBe("2025-05-11");
});

test("accept Sunday from calcSunday and returns next Sunday", () => {
  expect(calcWeekEnd("2025-05-11")).toBe("2025-05-18");
});
