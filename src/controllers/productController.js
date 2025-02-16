import pool from "../dbConfig.js";
import { v4 as uuidv4 } from "uuid";

// Posting/updating database with arrays

// export const upsertSeries = async (seriesObj) => {
//   //Add try catch
//   const [insertInfo] = await pool.execute(
//     `INSERT INTO series (id, name, publisher) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), publisher = VALUES(publisher)`,
//     [seriesObj.id, seriesObj.name, seriesObj.publisher]
//   );
//   const newId = insertInfo.insertId;
//   if (newId !== 0) {
//     seriesObj.id = newId;
//   }

//   await Promise.all(
//     seriesObj.skus.map((sku) => {
//       pool.execute(
//         `INSERT IGNORE INTO series_skus (sku, series_id) VALUES (?, ?)`,
//         [sku, seriesObj.id]
//       );
//     })
//   );
// };

export const upsertSeries = async (seriesArray) => {
  try {
    const [seriesSkus] = await pool.execute(`SELECT * FROM series_skus`);
    const seriesWithId = seriesArray.map((series) => {
      const row = seriesSkus.find((row) => series.skus.includes(row.sku));
      if (row) {
        series.id = row.id;
      } else {
        series.id = uuidv4();
      }
      return series;
    });

    const formattedForSeries = seriesWithId.map((seriesObj) => {
      return [seriesObj.id, seriesObj.name, seriesObj.publisher];
    });
    const seriesSql = `INSERT INTO series (id, name, publisher) VALUES ? ON DUPLICATE KEY UPDATE name = VALUES(name), publisher = VALUES(publisher)`;
    const [seriesResults] = await pool.query(seriesSql, [formattedForSeries]);
    console.log(seriesResults);

    const formattedForSkus = [];
    seriesWithId.map((seriesObj) => {
      seriesObj.skus.map((sku) => formattedForSkus.push([sku, seriesObj.id]));
    });
    console.log(formattedForSkus);
    const skuSql = `INSERT IGNORE INTO series_skus (sku, series_id) VALUES ?`;
    const [skuResults] = await pool.query(skuSql, [formattedForSkus]);
    console.log(skuResults);
    const [warnings] = await pool.query(`SHOW WARNINGS`);
    console.log(warnings);
  } catch (err) {
    console.error(err);
  }
};

// export const upsertProduct = async (productObj) => {
//   try {
//     await productObj.fetchSeriesId();

//     await pool.execute(
//       `INSERT INTO products (sku, product_name, item_code, msrp, release_date, foc_due_date, image_url, issue, variant, printing, series_id, publisher, product_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE sku = VALUES(sku), product_name = VALUES(product_name), item_code = VALUES(item_code), msrp = VALUES(msrp), release_date = VALUES(release_date), foc_due_date = VALUES(foc_due_date), image_url = VALUES(image_url), issue = VALUES(issue), variant = VALUES(variant), printing = VALUES(printing), series_id = VALUES(series_id), publisher = VALUES(publisher), product_type = VALUES(product_type)`,
//       [
//         productObj.sku,
//         productObj.productName,
//         productObj.itemCode,
//         productObj.msrp,
//         productObj.release,
//         productObj.focDueDate ?? null,
//         productObj.imageUrl ?? null,
//         productObj.issue ?? null,
//         productObj.variant ?? null,
//         productObj.printing ?? null,
//         productObj.seriesId ?? null,
//         productObj.publisher ?? null,
//         productObj.productType ?? null,
//       ]
//     );
//   } catch (err) {
//     console.error("Error adding product: ", err, productObj);
//   }
// };

export const upsertProduct = async (productArray) => {
  const productsWithSeries = await Promise.all(
    productArray.map((productObj) => productObj.fetchSeriesId())
  );
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

  try {
    const [results] = await pool.query(sql, [formattedData]);
    console.log(results);
  } catch (err) {
    console.error(err);
  }
};
