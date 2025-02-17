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
    res.status(200).send(result);
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

  const allowedFields = ["name", "email", "box_number", "phone", "status"];
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

//Pull Routes

export async function addPull(req, res) {
  const userId = req.params.id;
  const productId = req.body.productId;

  try {
    const values = [userId, productId];
    const sql = `INSERT INTO pulls_list (user_id, product_id) VALUES (?, ?)`;

    const [result] = await pool.execute(sql, values);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function changePullAmount(req, res) {
  const userId = req.params.id;
  const productId = req.body.productId;
  const amount = req.body.amount;

  try {
    const values = [amount, userId, productId];
    const sql = `UPDATE pulls_list SET amount = ? WHERE user_id = ? AND product_id = ?`;

    const [result] = await pool.execute(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No pull found" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function removePull(req, res) {
  const userId = req.params.id;
  const productId = req.body.productId;

  try {
    const sql = `DELETE FROM pulls_list WHERE user_id = ? AND product_id = ?`;

    const [result] = await pool.execute(sql, [userId, productId]);

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "No matching pull to remove" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

//Sub Routes

export async function addSub(req, res) {
  const userId = req.params.id;
  const seriesId = req.body.seriesId;

  try {
    const sql = `INSERT INTO subscriptions (user_id, series_id) VALUES (?, ?)`;

    const [result] = await pool.execute(sql, [userId, seriesId]);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function removeSub(req, res) {
  const userId = req.params.id;
  const seriesId = req.body.seriesId;

  try {
    const sql = `DELETE FROM subscriptions WHERE user_id = ? AND series_id = ?`;

    const [result] = await pool.execute(sql, [userId, seriesId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
