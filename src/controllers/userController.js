import pool from "../dbConfig.js";

export async function getAllUsers(req, res) {
  try {
    const [rows] = await pool.execute("SELECT * FROM users");
    res.status(200).send(rows);
  } catch (err) {
    console.error(err);
  }
}

export async function getOneUser(req, res) {
  try {
    const userID = req.params.id;
    const [user] = await pool.execute("SELECT * FROM users WHERE ID = ?", [
      userID,
    ]);
    res.status(200).send(user);
  } catch (err) {
    console.error(err);
  }
}
// export default getAllUsers;
