import ExcelJS from "exceljs";
import { Product } from "../models/productModel.js";
import { Series } from "../models/seriesModel.js";

export const categoryObj = {
  // Translate from category/sort column of excel
  HC: "Hardcover",
  HCMR: "Hardcover",
  OMNIBUS: "Hardcover",
  TP: "Trade Paperback",
  TR: "Trade Paperback",
  TRMR: "Trade Paperback",
  COMICS: "Comic",
  COMIC: "Comic",
  CB: "Comic",
  CBPM: "Comic",
  BXS: "Box Set",
  BXHC: "Box Set",
  BXTR: "Box Set",
  GN: "Graphic Novel",
  PS: "Poster",
  "Q.VARIANTS": "Incentive",
};

const marvelPriceSwitch = {
  // Translate suggested CAD MSRP to USD MSRP for Marvel
  "$5.00": "$3.99",
  "$6.25": "$4.99",
  "$7.50": "$5.99",
  "$8.75": "$6.99",
  "$10.00": "$7.99",
  "$11.25": "$8.99",
  "$12.50": "$9.99",
};
const indiePriceSwitch = {
  // Translate suggested CAD MSRP to USD MSRP for Indies
  "$5.29": "$3.99",
  "$6.99": "$4.99",
  "$7.99": "$5.99",
  "$9.50": "$6.99",
  "$10.99": "$7.99",
  "$11.99": "$8.99",
  "$12.99": "$9.99",
};
const keyTranslation = {
  "Product Name": "productName",
  "Item Code": "itemCode",
  Sku: "sku",
  MSRP: "msrp",
  Release: "release",
  "FOC Due Date": "focDueDate",
  "Image URL": "imageUrl",
};

export async function xlsxToObjects(workbook, publisher) {
  const books = [];
  const header = [];
  let series = [];

  workbook.worksheets[0].getRow(1).eachCell((cell) => {
    header.push(cell.value);
  });

  workbook.worksheets[0].eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      const rowList = [];
      row.eachCell((cell) => {
        const cellValue = cell.value;
        if (typeof cellValue === "object") {
          rowList.push(cellValue.text);
        } else {
          rowList.push(cellValue);
        }
      });

      const book = new Product();
      let category;
      header.forEach((key, index) => {
        if (key === "Category" || key === "Sort") {
          category = rowList[index];
          return;
        }
        const formattedKey = keyTranslation[key];
        if (formattedKey) book[formattedKey] = rowList[index];
      });

      book.setIssue = book.productName;

      book.publisher = publisher;

      if (category.includes("1:")) {
        book.productType = "Incentive";
        book.incentive = category;
      } else {
        book.productType = categoryObj[category] || "Remove";
      }
      if (book.productType === "Remove") {
        return;
      }

      if (book.productType === "Comic" || book.productType === "Incentive") {
        // Handle series, variant, and printing info for comics

        book.variant = book.sku.slice(15, 16);
        book.printing = book.sku.slice(16);

        if (!series.some((obj) => obj.skus.includes(book.seriesSku))) {
          const seriesObj = new Series(book.publisher, [book.seriesSku]);
          seriesObj.properTitle = book.productName;
          series.push(seriesObj);
        }
      }

      if (
        book.publisher === "Marvel" &&
        (book.productType === "Comic" || book.productType === "Incentive")
      ) {
        book.msrp = marvelPriceSwitch[book.msrp]
          ? marvelPriceSwitch[book.msrp]
          : book.msrp;
      }
      if (
        book.publisher === "Idw" &&
        (book.publisher === "Comic" || book.publisher === "Incentive")
      ) {
        book.msrp = indiePriceSwitch[book.msrp]
          ? indiePriceSwitch[book.msrp]
          : book.msrp;
      }
      books.push(book);
    }
  });

  const sorted = bookSort(books);

  const seriesNames = series.map((series) => series.name);
  const duplicates = seriesNames.filter(
    (title, index) => seriesNames.indexOf(title) !== index
  );
  duplicates.forEach((title) => {
    const dupIndices = series.reduce((acc, currentValue, index) => {
      if (currentValue.name === title) {
        acc.push(index);
      }
      return acc;
    }, []);

    const skuArray = [];
    dupIndices.forEach((indNumber) => {
      skuArray.push(...series[indNumber].skus);
    });
    series[dupIndices[0]].skus = skuArray;

    const copyIndices = dupIndices.slice(1);
    series = series.filter((_, index) => !copyIndices.includes(index));
  });

  return {
    newBooks: sorted,
    seriesList: series,
  };
}

export const bookSort = (bookArray) => {
  const currentDate = new Date();

  const newBooks = [];
  const oldBooks = [];
  bookArray.forEach((book) => {
    const releaseDate = new Date(book.release);
    if (releaseDate > currentDate) {
      newBooks.push(book);
    } else {
      oldBooks.push(book);
    }
  });

  const beforeFoc = [];
  const afterFoc = [];
  newBooks.forEach((book) => {
    const focDate = new Date(book.focDueDate);
    if (focDate > currentDate) {
      afterFoc.push(book);
    } else {
      beforeFoc.push(book);
    }
  });

  afterFoc.sort((a, b) => {
    const dateComp = new Date(a.focDueDate) - new Date(b.focDueDate);
    if (dateComp === 0) {
      return a.Issue - b.Issue;
    }
    return dateComp;
  });
  beforeFoc.sort((a, b) => {
    const dateComp = new Date(b.focDueDate) - new Date(a.focDueDate);
    if (dateComp === 0) {
      return a.Issue - b.Issue;
    }
    return dateComp;
  });
  const sortedBooks = afterFoc.concat(beforeFoc).concat(oldBooks);
  return sortedBooks;
};

export async function processExcel(filePaths, publisherArray) {
  const booksArray = [];
  const seriesArray = [];

  for (let i = 0; i < filePaths.length; i++) {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePaths[i]);

      workbook.removeWorksheet(2); //Clear useless sheets and rows
      workbook.worksheets[0].spliceRows(1, 1);

      const publisherName = publisherArray[i];

      const { newBooks, seriesList } = await xlsxToObjects(
        workbook,
        publisherName
      );

      booksArray.push(...newBooks);
      seriesArray.push(...seriesList);
    } catch (error) {
      console.error(`Error processing file: ${error.message}`);
      continue;
    }
  }

  return { booksArray, seriesArray };
}
