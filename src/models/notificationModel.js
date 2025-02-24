export class Notification {
  constructor(notificationObj) {
    this.title = notificationObj.title;
    this.body = notificationObj.body;
    this.imageUrl = notificationObj.imageUrl || null;
  }
  arrayFormat() {
    return [this.title, this.body, this.imageUrl];
  }
}
