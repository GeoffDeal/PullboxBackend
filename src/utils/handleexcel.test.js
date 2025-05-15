import { afterEach, beforeEach, expect, jest } from "@jest/globals";

jest.unstable_mockModule("exceljs", () => ({
  default: jest.fn().mockImplementation(() => ({
    xlsx: {
      readFile: jest.fn().mockResolvedValue(),
    },
    removeWorksheet: jest.fn(),
    worksheets: [
      {
        spliceRows: jest.fn(),
        getRow: (rowNumber) => {
          const rows = {
            1: {
              eachCell: (cb) => {
                [
                  "Product Name",
                  "Category",
                  "Item Code",
                  "Sku",
                  "MSRP",
                  "Release",
                  "FOC Due Date",
                  "Qty. Ord. On Time",
                  "Qty. Ord. Late",
                  "Image URL",
                ].forEach((value) => cb({ value }));
              },
            },
          };
          return rows[rowNumber] || { eachCell: () => {} };
        },

        eachRow: (cb) => {
          cb(
            {
              number: 1,
              eachCell: (cellCb) => {
                [
                  "Product Name",
                  "Category",
                  "Item Code",
                  "Sku",
                  "MSRP",
                  "Release",
                  "FOC Due Date",
                  "Qty. Ord. On Time",
                  "Qty. Ord. Late",
                  "Image URL",
                ].forEach((value) => cellCb({ value }));
              },
            },
            1
          );

          cb(
            {
              number: 2,
              eachCell: (cellCb) => {
                [
                  "MIGHTY MMW: FANTASTIC FOUR VOL. 4 - THE FRIGHTFUL FOUR",
                  "TR",
                  "MRVL01250200",
                  "9781302954369",
                  "$20.00",
                  "2025-12-24",
                  "2025-10-13",
                  "",
                  "",
                  "https://universaldist.com/api/v1/images/1ae700a7-95eb-49ce-be70-a3f758b8f1c7/raw?size=l",
                ].forEach((value) =>
                  cellCb(typeof value === "object" ? value : { value })
                );
              },
            },
            2
          );

          cb(
            {
              number: 3,
              eachCell: (cellCb) => {
                [
                  "MIGHTY MMW: THE X-MEN VOL. 4 - FACTOR THREE ORIGINAL COVER [DM ONLY]",
                  "TR",
                  "MRVL01250202",
                  "9781302954437",
                  "$20.00",
                  "2025-12-24",
                  "2025-10-13",
                  "",
                  "",

                  "https://universaldist.com/api/v1/images/8c46f3d6-d06e-4ff0-a998-56953a5e0d21/raw?size=l",
                ].forEach((value) =>
                  cellCb(typeof value === "object" ? value : { value })
                );
              },
            },
            3
          );

          cb(
            {
              number: 4,
              eachCell: (cellCb) => {
                [
                  "SPIDER-GIRL #1",
                  "CB",
                  "MRVL02250246",
                  "75960621192000111",
                  "$6.25",
                  "2025-06-11",
                  "2025-04-28",
                  "",
                  "",
                  "https://universaldist.com/api/v1/images/1116e6fb-7cb0-4e97-95ca-db9ee2f98a0a/raw?size=l",
                ].forEach((value) =>
                  cellCb(typeof value === "object" ? value : { value })
                );
              },
            },
            4
          );
        },
      },
    ],
  })),
}));

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(new Date("2025-01-01"));
});

afterEach(() => {
  jest.useRealTimers();
});

test("sorts an array of products by date", async () => {
  const { bookSort } = await import("./handleexcel.js");

  const inputBooks = [
    {
      title: "Future Book After FOC",
      release: "2025-02-01",
      focDueDate: "2024-12-30",
      Issue: 2,
    },
    {
      title: "Future Book Before FOC",
      release: "2025-02-01",
      focDueDate: "2025-01-15",
      Issue: 1,
    },
    {
      title: "Past Release",
      release: "2024-10-01",
      focDueDate: "2024-08-01",
      Issue: 3,
    },
    {
      title: "Future Book Before FOC (2nd Issue)",
      release: "2025-02-01",
      focDueDate: "2025-01-15",
      Issue: 2,
    },
  ];

  const sorted = bookSort(inputBooks);

  expect(sorted.map((b) => b.title)).toEqual([
    "Future Book Before FOC",
    "Future Book Before FOC (2nd Issue)",
    "Future Book After FOC",
    "Past Release",
  ]);
});

test("takes an exceljs workbook and returns objects arrays of objects for products and series", async () => {
  const { default: ExcelJS } = await import("exceljs");
  const { xlsxToObjects } = await import("./handleexcel.js");
  const { Product } = await import("../models/productModel.js");
  const { Series } = await import("../models/seriesModel.js");

  const workbook = new ExcelJS();
  const publisher = "Marvel";

  const { newBooks, seriesList } = await xlsxToObjects(workbook, publisher);

  expect(newBooks).toHaveLength(3);
  newBooks.forEach((book) => {
    expect(book).toBeInstanceOf(Product);
    expect(book.publisher).toBe("Marvel");
  });
  const testBook = newBooks.find((book) => book.sku === "9781302954369");
  expect(testBook.productName).toBe(
    "MIGHTY MMW: FANTASTIC FOUR VOL. 4 - THE FRIGHTFUL FOUR"
  );
  expect(testBook.itemCode).toBe("MRVL01250200");
  expect(testBook.msrp).toBe("$20.00");
  expect(testBook.release).toBe("2025-12-24");
  expect(testBook.focDueDate).toBe("2025-10-13");
  expect(testBook.imageUrl).toMatch(
    /^https:\/\/universaldist\.com\/api\/v1\/images\//
  );
  expect(testBook.issue).toBe("4");

  expect(seriesList).toHaveLength(1);
  expect(seriesList[0]).toBeInstanceOf(Series);
});
