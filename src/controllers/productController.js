import pool from "../dbConfig.js";
import { promises as fs } from "fs";
import { processExcel } from "../utils/handleexcel.js";
import { subsToPulls } from "./subscriptionController.js";
import { v4 as uuidv4 } from "uuid";
import { transformProduct } from "../datatransformers/productTransformers.js";
import { calcSunday, calcWeekEnd } from "../utils/timeFunctions.js";

export const upsertSeries = async (seriesArray) => {
  try {
    const [seriesSkus] = await pool.execute(`SELECT * FROM series_skus`);
    const seriesWithId = seriesArray.map((series) => {
      const row = seriesSkus.find((row) => series.skus.includes(row.sku));
      if (row) {
        series.id = row.series_id;
      } else {
        series.id = uuidv4();
      }
      return series;
    });

    const formattedForSeries = seriesWithId.map((seriesObj) => {
      return [seriesObj.id, seriesObj.name, seriesObj.publisher];
    });
    const seriesSql = `INSERT INTO series (id, name, publisher) VALUES ? ON DUPLICATE KEY UPDATE name = VALUES(name), publisher = VALUES(publisher)`;
    await pool.query(seriesSql, [formattedForSeries]);

    const formattedForSkus = [];
    seriesWithId.map((seriesObj) => {
      seriesObj.skus.map((sku) => formattedForSkus.push([sku, seriesObj.id]));
    });
    const skuSql = `INSERT IGNORE INTO series_skus (sku, series_id) VALUES ?`;
    await pool.query(skuSql, [formattedForSkus]);
  } catch (err) {
    console.error(err);
  }
};

export const upsertProduct = async (productArray) => {
  try {
    const seriesSkus = productArray.map((product) => product.seriesSku);

    const seriesSql = `SELECT * FROM series_skus WHERE sku IN (?)`;
    const [results] = await pool.query(seriesSql, [seriesSkus]);

    const productsWithSeries = productArray.map((product) => {
      const seriesRow = results.find((row) => product.seriesSku === row.sku);
      product.seriesId = seriesRow ? seriesRow.series_id : null;
      return product;
    });

    const formattedData = productsWithSeries.map((productObj) =>
      productObj.arrayFormat()
    );

    const sql = `INSERT INTO products (sku, product_name, item_code, msrp, release_date, foc_due_date, image_url, issue, variant, printing, incentive, series_id, publisher, product_type) VALUES ? ON DUPLICATE KEY UPDATE sku = VALUES(sku), product_name = VALUES(product_name), item_code = VALUES(item_code), msrp = VALUES(msrp), release_date = VALUES(release_date), foc_due_date = VALUES(foc_due_date), image_url = VALUES(image_url), issue = VALUES(issue), variant = VALUES(variant), printing = VALUES(printing), series_id = VALUES(series_id), publisher = VALUES(publisher), product_type = VALUES(product_type)`;

    await pool.query(sql, [formattedData]);
  } catch (err) {
    console.error(err);
  }
};

export async function getProduct(req, res) {
  const productId = req.params.id;

  try {
    const sql = `SELECT * FROM products WHERE id = ?`;
    const [result] = await pool.execute(sql, [productId]);

    if (result.length !== 0) {
      const formattedProduct = transformProduct(result[0]);
      return res.status(200).json(formattedProduct);
    }
    res.status(404).json({ error: "Product not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getBrowsed(req, res) {
  const { week, date, product, publisher, limit = 20, page = 1 } = req.query;

  const weekBegin = calcSunday(date);
  const weekEnd = calcWeekEnd(weekBegin);
  try {
    let sql = ``;
    const params = [weekBegin, weekEnd];

    if (week === "foc") {
      sql += ` foc_due_date >= ? AND foc_due_date < ?`;
    } else {
      sql += " release_date >= ? AND release_date < ?";
    }
    if (product && product !== "All") {
      sql += ` AND product_type = ?`;
      params.push(product);
    }
    if (publisher && publisher !== "All") {
      sql += ` AND publisher = ?`;
      params.push(publisher);
    }
    sql += ` AND (variant = 1 OR variant IS NULL)`;

    const countSql = `SELECT COUNT(*) AS totalCount FROM products WHERE` + sql;
    const [countResults] = await pool.query(countSql, params);
    const numberLimit = parseInt(limit);
    const numberPage = parseInt(page);
    const totalCount = countResults[0].totalCount;
    const maxPages = Math.ceil(totalCount / numberLimit);
    const validPage = maxPages === 0 ? 1 : Math.min(numberPage, maxPages);
    const offset = (validPage - 1) * numberLimit;

    let querySql = `SELECT * FROM products WHERE`;
    querySql += sql;
    querySql += ` ORDER BY 
        CASE 
          WHEN foc_due_date >= CURDATE() THEN 1 
          WHEN release_date >= CURDATE() THEN 2 
          ELSE 3 
        END, 
        foc_due_date ASC, 
        release_date ASC 
      LIMIT ? OFFSET ?`;
    params.push(numberLimit, offset);

    const [results] = await pool.query(querySql, params);

    if (results.length === 0) {
      return res.status(204).json({
        message: "No results found",
        meta: { maxPages: 1, currentPage: 1 },
      });
    }

    const formattedResults = results.map((product) =>
      transformProduct(product)
    );
    res.status(200).json({
      data: formattedResults,
      meta: {
        maxPages: maxPages,
        currentPage: validPage,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getSearched(req, res) {
  const { term, limit = 20, page = 1 } = req.query;
  const relevanceTerm = 2.5;

  try {
    const countSql = `
      SELECT COUNT(*) AS totalCount
      FROM (
        SELECT MATCH(product_name) AGAINST(? IN NATURAL LANGUAGE MODE) AS relevance
        FROM products
        WHERE MATCH(product_name) AGAINST(? IN NATURAL LANGUAGE MODE)
        HAVING relevance > ?
      ) AS filtered
    `;
    const [countResults] = await pool.query(countSql, [
      term,
      term,
      relevanceTerm,
    ]);

    const numberLimit = parseInt(limit);
    const numberPage = parseInt(page);
    const totalCount = countResults[0].totalCount;
    const maxPages = Math.ceil(totalCount / numberLimit);
    const validPage = maxPages === 0 ? 1 : Math.min(numberPage, maxPages);
    const offset = (validPage - 1) * numberLimit;

    const sql = `
      SELECT *, 
        MATCH(product_name) AGAINST(? IN NATURAL LANGUAGE MODE) AS relevance
      FROM products
      WHERE MATCH(product_name) AGAINST(? IN NATURAL LANGUAGE MODE)
      HAVING relevance > ?
      ORDER BY 
        relevance DESC,
        CASE 
          WHEN foc_due_date >= CURDATE() THEN 1 
          WHEN release_date >= CURDATE() THEN 2 
          ELSE 3 
        END,
        foc_due_date ASC, 
        release_date ASC
      LIMIT ? OFFSET ?
    `;
    const values = [term, term, relevanceTerm, numberLimit, offset];

    const [results] = await pool.query(sql, values);

    if (results.length === 0) {
      return res.status(204).json({ message: "No products found" });
    }

    const formattedData = results.map(transformProduct);
    res.status(200).json({
      data: formattedData,
      meta: {
        maxPages: maxPages,
        currentPage: validPage,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAllVar(req, res) {
  const { seriesId, issue } = req.query;

  try {
    const sql = `SELECT * FROM products WHERE series_id = ? AND issue = ?`;
    const [results] = await pool.execute(sql, [seriesId, issue]);

    if (results.length === 0) {
      return res.status(204).json({ message: "No products found" });
    }

    const formattedData = results.map(transformProduct);
    res.status(200).json(formattedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getSeries(req, res) {
  const seriesId = req.params.id;
  try {
    const sql = `SELECT * FROM series WHERE id = ?`;
    const [results] = await pool.execute(sql, [seriesId]);

    if (results.length === 0) {
      return res.status(400).json({ message: "Series not found" });
    }
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getSeriesBooks(req, res) {
  const seriesId = req.params.id;
  try {
    const sql = `SELECT * FROM products WHERE series_id = ? AND variant = 1`;
    const [results] = await pool.execute(sql, [seriesId]);

    if (results.length === 0) {
      return res.status(400).json({ message: "Series not found" });
    }
    const formattedData = results.map(transformProduct);
    res.status(200).json(formattedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Handle importing excel sheets

export async function postExcel(req, res) {
  const body = req.body;
  const files = req.files;
  const filePaths = [];
  const publishers = [];

  try {
    for (const [index, file] of files.entries()) {
      const publisher = body.uploads[index]?.publisher;
      if (!publisher) {
        throw new Error(`Missing publisher for file at index ${index}`);
      }

      filePaths.push(file.path);
      publishers.push(publisher);
    }

    const { booksArray, seriesArray } = await processExcel(
      filePaths,
      publishers
    );

    await upsertSeries(seriesArray);
    await upsertProduct(booksArray);
    await subsToPulls();

    res.status(200).json({ message: "Upload successful" });
  } catch (error) {
    console.error("Error processing files:", error); // Log the error
    res
      .status(500)
      .json({ error: `Failed to process files: ${error.message}` });
  } finally {
    try {
      await Promise.all(filePaths.map((path) => fs.unlink(path)));
      console.log("Excel files deleted");
    } catch (err) {
      console.error("Error deleting files:", err);
    }
  }
}
