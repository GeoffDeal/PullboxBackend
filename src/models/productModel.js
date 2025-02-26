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
    this.incentive = null;
    this.seriesId = null;
    this.publisher = null;
    this.productType = null;
  }
  get seriesSku() {
    return this.sku.slice(0, 12);
  }
  set setIssue(title) {
    let firstCut = title.indexOf("#");
    let cutTitle;
    if (firstCut === -1) {
      firstCut = title.indexOf("VOL.");
    }

    if (firstCut !== -1) {
      cutTitle = title.slice(firstCut);
    }
    const number = cutTitle ? cutTitle.match(/\d+/) : null;
    const issueNumber = number ? number[0] : -1; // -1 for books without an issue or vol number, reserving 0 for the few books which use it

    this.issue = issueNumber;
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
      this.incentive,
      this.seriesId,
      this.publisher,
      this.productType,
    ];
  }
}
