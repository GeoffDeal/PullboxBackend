import pool from "../dbConfig.js";

async function getAllUsers() {
  try {
    const [rows, fields] = await pool.execute("SELECT * FROM users");
    console.log(rows);
    console.log(fields);
  } catch (err) {
    console.error(err);
  }
}

export default getAllUsers;
