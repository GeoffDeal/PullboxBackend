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
