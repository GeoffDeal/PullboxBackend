import pool from "../dbConfig.js";

export async function getAllUsers(req, res) {
  try {
    const [users] = await pool.execute("SELECT * FROM users");
    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
  }
}

export async function getOneUser(req, res) {
  try {
    const userId = req.params.id;
    const [user] = await pool.execute("SELECT * FROM users WHERE ID = ?", [
      userId,
    ]);
    res.status(200).json(user[0]);
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
      "pending",
    ];

    const [result] = await pool.execute(
      "INSERT INTO users (name, email, phone, customer, status) VALUES (?, ?, ?, ?, ?)",
      userValues
    );
    res.status(201).send(result);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create user: ", error: err.message });
  }
}

export async function changeUserStatus(req, res) {
  const userId = req.params.id;
  const newStatus = req.body.status;
  try {
    const sql = `UPDATE users SET status = ? WHERE id = ?`;
    const [result] = await pool.execute(sql, [newStatus, userId]);

    if (result.affectRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User status updated" });
  } catch (err) {
    console.error("Error updating status: ", err);
    res.status(500).json({ error: "Internal server error " });
  }
}

export async function updateUser(req, res) {
  const userId = req.params.id;
  const updates = req.body;

  const allowedFields = ["name", "email", "box_number", "phone"];
  const fieldsToUpdate = Object.keys(updates).filter((field) =>
    allowedFields.includes(field)
  );

  if (fieldsToUpdate.length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  try {
    const sets = fieldsToUpdate.map((field) => `\`${field}\` = ?`).join(", ");
    const values = fieldsToUpdate.map((field) => updates[field]);
    const sql = `UPDATE users SET ${sets} WHERE id =?`;

    const [result] = await pool.execute(sql, [...values, userId]);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
