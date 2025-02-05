import pool from "../dbConfig.js";

// Posting/updating database with arrays

export const upsertSeries = async (seriesObj) => {
  const [insertInfo] = await pool.execute(
    `INSERT INTO series (id, name, publisher) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), publisher = VALUES(publisher)`,
    [seriesObj.id, seriesObj.name, seriesObj.publisher]
  );
  const newId = insertInfo.insertId;
  if (newId !== 0) {
    seriesObj.id = newId;
  }

  await Promise.all(
    seriesObj.skus.map((sku) => {
      pool.execute(
        `INSERT IGNORE INTO series_skus (sku, series_id) VALUES (?, ?)`,
        [sku, seriesObj.id]
      );
    })
  );
};
