import pool from "../dbConfig.js";

export class Product {
  constructor(product) {
    this.sku = product.Sku;
    this.productName = product.ProductName;
    this.itemCode = product.ItemCode;
    this.msrp = product.MSRP;
    this.release = product.Release;
    this.focDueDate = product.FocDueDate;
    this.imageUrl = product.ImageUrl;
    this.issue = product.Issue;
    this.variant = product.Variant;
    this.printing = product.Printing;
    this.seriesId = null;
    this.publisher = product.Publisher;
    this.productType = product.ProductType;
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
  constructor(series) {
    this.name = series.name;
    this.publisher = series.publisher;
    this.skus = series.skus;
    this.id = null;
  }
}
