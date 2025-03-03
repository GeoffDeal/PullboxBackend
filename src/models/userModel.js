import * as yup from "yup";
import pool from "../dbConfig.js";
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

async function emailCheck(email) {
  try {
    const [check] = await pool.execute(
      "SELECT EXISTS(SELECT * FROM users WHERE email = ?) AS emailExists",
      [email]
    );
    return !check[0].emailExists;
  } catch (err) {
    console.error(err);
  }
}

export const userSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters long")
    .max(20, "Name must be less than 20 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .test(
      "unique-email",
      "There is already a user with this email",
      async function (value) {
        if (!value) return false;
        return await emailCheck(value);
      }
    ),
  phone: yup.string(),
});
