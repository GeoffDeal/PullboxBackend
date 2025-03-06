export class User {
  constructor(userObj) {
    if (!userObj.name || !userObj.email) {
      throw new Error("Required fields cannot be left blank");
    }
    this.name = userObj.name;
    this.email = userObj.email;
    this.phone = userObj.phone;
    this.customer = true;
    this.status = "pending";
  }
  arrayFormat() {
    return [this.name, this.email, this.phone, this.customer, this.status];
  }
}
