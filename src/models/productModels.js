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
    seriesID,
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
    this.seriesID = seriesID;
    this.publisher = publisher;
    this.productType = productType;
  }
}

export class Series {
  constructor(name, publisher, skus) {
    this.name = name;
    this.publisher = publisher;
    this.skus = skus;
    this.series_id = null;

    this.fetchId(skus)
      .then((results) => (this.series_id = results || null))
      .catch((err) => {
        console.error("Error during id assignment", err);
      });
  }
  async fetchId(skus) {
    try {
      const [results] = await pool.execute(
        `SELECT * FROM series_skus WHERE sku IN ?`,
        [skus]
      );
      if (results && results.length) {
        return results[0];
      }
      return null;
    } catch (err) {
      console.error("Error fetching ID:", err);
      return null;
    }
  }
}
