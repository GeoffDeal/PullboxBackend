import pool from "../dbConfig.js";

export class Product {
  constructor(
    sku,
    productName,
    itemCode,
    msrp,
    release,
    focDueDate,
    imageUrl,
    issue,
    variant,
    printing,
    seriesId,
    publisher,
    productType
  ) {
    this.sku = sku;
    this.productName = productName;
    this.itemCode = itemCode;
    this.msrp = msrp;
    this.release = release;
    this.focDueDate = focDueDate;
    this.imageUrl = imageUrl;
    this.issue = issue;
    this.variant = variant;
    this.printing = printing;
    this.seriesId = seriesId;
    this.publisher = publisher;
    this.productType = productType;
  }
  async fetchSeriesId() {
    const seriesSku = this.sku.slice(0, 12);
    try {
      const [results] = await pool.execute(
        `SELECT * FROM series_skus WHERE sku = ?`,
        [seriesSku]
      );
      if (results && results.length) {
        this.seriesId = results[0].series_id;
      } else {
        this.seriesId = null;
      }
    } catch (err) {
      console.error("Error fetching ID:", err);
      return null;
    }
  }
}

export class Series {
  constructor(name, publisher, skus) {
    this.name = name;
    this.publisher = publisher;
    this.skus = skus;
    this.id = null;
  }
  async fetchId() {
    const skus = this.skus;
    try {
      const placeHolders = skus.map(() => "?").join(",");
      const [results] = await pool.execute(
        `SELECT * FROM series_skus WHERE sku IN (${placeHolders})`,
        skus
      );
      if (results && results.length) {
        this.id = results[0].series_id;
      } else {
        this.id = null;
      }
    } catch (err) {
      console.error("Error fetching ID:", err);
      return null;
    }
  }
}
