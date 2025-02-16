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

export async function createUser(req, res) {
  try {
    const newUser = req.body;
    const userValues = [
      newUser.name,
      newUser.email,
      newUser.phone,
      true,
      "active",
    ];

    const [result] = await pool.execute(
      "INSERT INTO users (name, email, phone, customer, customer_type) VALUES (?, ?, ?, ?, ?)",
      userValues
    );
    res.status(200).send(result);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create user: ", error: err.message });
  }
}
