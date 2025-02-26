export class Product {
  constructor(product) {
    this.sku = product.Sku;
    this.productName = product.ProductName;
    this.itemCode = product.ItemCode;
    this.msrp = product.MSRP;
    this.release = product.Release;
    this.focDueDate = product.FOCDueDate ?? null;
    this.imageUrl = product.ImageURL ?? null;
    this.issue = product.Issue ?? null;
    this.variant = product.Variant ?? null;
    this.printing = product.Printing ?? null;
    this.seriesId = null;
    this.publisher = product.Publisher ?? null;
    this.productType = product.ProductType ?? null;
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
