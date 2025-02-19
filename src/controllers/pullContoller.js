import pool from "../dbConfig.js";

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
