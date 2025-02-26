export class Series {
  constructor(publisher, skus) {
    this.name = "";
    this.publisher = publisher;
    this.skus = skus;
    this.id = null;
  }
  set properTitle(title) {
    let cutIndex = -1;
    const hastagIndex = title.indexOf("#");
    cutIndex = hastagIndex;
    if (cutIndex === -1) {
      cutIndex = title.toLowerCase().indexOf("cvr");
    }

    const capitalTitle = cutIndex !== -1 ? title.slice(0, cutIndex - 1) : title;
    const words = capitalTitle.toLowerCase().split(" ");
    const properTitle = words
      .map((word) => {
        return word.replace(word.charAt(0), word.charAt(0).toUpperCase());
      })
      .join(" ");

    this.name = properTitle;
  }
}
