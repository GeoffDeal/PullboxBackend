import pool from "../dbConfig.js";
import { v4 as uuidv4 } from "uuid";

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
    const [results] = await pool.execute(`SELECT * FROM series_skus`);

    const productsWithSeries = productArray.map((product) => {
      const seriesSku = product.sku.slice(0, 12);
      const seriesRow = results.find((row) => seriesSku === row.sku);
      product.seriesId = seriesRow ? seriesRow.series_id : null;
      return product;
    });

    const formattedData = productsWithSeries.map((productObj) => [
      productObj.sku,
      productObj.productName,
      productObj.itemCode,
      productObj.msrp,
      productObj.release,
      productObj.focDueDate ?? null,
      productObj.imageUrl ?? null,
      productObj.issue ?? null,
      productObj.variant ?? null,
      productObj.printing ?? null,
      productObj.seriesId ?? null,
      productObj.publisher ?? null,
      productObj.productType ?? null,
    ]);

    const sql = `INSERT INTO products (sku, product_name, item_code, msrp, release_date, foc_due_date, image_url, issue, variant, printing, series_id, publisher, product_type) VALUES ? ON DUPLICATE KEY UPDATE sku = VALUES(sku), product_name = VALUES(product_name), item_code = VALUES(item_code), msrp = VALUES(msrp), release_date = VALUES(release_date), foc_due_date = VALUES(foc_due_date), image_url = VALUES(image_url), issue = VALUES(issue), variant = VALUES(variant), printing = VALUES(printing), series_id = VALUES(series_id), publisher = VALUES(publisher), product_type = VALUES(product_type)`;

    await pool.query(sql, [formattedData]);
  } catch (err) {
    console.error(err);
  }
};
