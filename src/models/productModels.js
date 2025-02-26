export class Product {
  constructor() {
    this.sku = "";
    this.productName = "";
    this.itemCode = "";
    this.msrp = "";
    this.release = "";
    this.focDueDate = null;
    this.imageUrl = null;
    this.issue = null;
    this.variant = null;
    this.printing = null;
    this.seriesId = null;
    this.publisher = null;
    this.productType = null;
  }
  get seriesSku() {
    return this.sku.slice(0, 12);
  }
  arrayFormat() {
    return [
      this.sku,
      this.productName,
      this.itemCode,
      this.msrp,
      this.release,
      this.focDueDate,
      this.imageUrl,
      this.issue,
      this.variant,
      this.printing,
      this.seriesId,
      this.publisher,
      this.productType,
    ];
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
