import pool from "../dbConfig.js";

export class Product {
  constructor(product) {
    this.sku = product.sku;
    this.productName = product.productName;
    this.itemCode = product.itemCode;
    this.msrp = product.msrp;
    this.release = product.release;
    this.focDueDate = product.focDueDate;
    this.imageUrl = product.imageUrl;
    this.issue = product.issue;
    this.variant = product.variant;
    this.printing = product.printing;
    this.seriesId = product.seriesId;
    this.publisher = product.publisher;
    this.productType = product.productType;
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
      return this;
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
