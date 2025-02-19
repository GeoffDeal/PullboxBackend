import pool from "../dbConfig.js";

//Sub Functions

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
  const pullId = req.params.id;

  try {
    const sql = `DELETE FROM subscriptions WHERE id = ?`;

    const [result] = await pool.execute(sql, [pullId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function subsToPulls(productArray) {
  try {
    const [results] = await pool.execute(`SELECT * FROM subscriptions`);

    const subbedProducts = productArray.filter;
  } catch (err) {
    console.error(err);
  }
}
