export class Product {
  constructor(product) {
    this.sku = product.Sku;
    this.productName = product.ProductName;
    this.itemCode = product.ItemCode;
    this.msrp = product.MSRP;
    this.release = product.Release;
    this.focDueDate = product.FOCDueDate;
    this.imageUrl = product.ImageURL;
    this.issue = product.Issue;
    this.variant = product.Variant;
    this.printing = product.Printing;
    this.seriesId = null;
    this.publisher = product.Publisher;
    this.productType = product.ProductType;
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
