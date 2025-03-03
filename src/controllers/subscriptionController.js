import pool from "../dbConfig.js";

//Sub Functions

export async function addSub(req, res) {
  const { userId, seriesId } = req.body;

  try {
    const subSql = `INSERT IGNORE INTO subscriptions (user_id, series_id) VALUES (?, ?)`;
    const [result] = await pool.execute(subSql, [userId, seriesId]);

    const selectSql = `SELECT * FROM products WHERE series_id = ? AND variant = '1' AND printing = '1'`;
    const [selectResult] = await pool.execute(selectSql, [seriesId]);

    const pullValues = selectResult.map((product) => [userId, product.id]);
    const pullSql = `INSERT IGNORE INTO pulls_list (user_id, product_id) VALUES ?`;
    await pool.query(pullSql, [pullValues]);

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function removeSub(req, res) {
  const subId = req.params.id;

  try {
    const sql = `DELETE FROM subscriptions WHERE id = ?`;

    const [result] = await pool.execute(sql, [subId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function subsToPulls() {
  try {
    const date = new Date();
    const formattedDate = new Intl.DateTimeFormat("en-CA").format(date);

    const joinSql = `SELECT subscriptions.user_id, products.id FROM subscriptions INNER JOIN products ON subscriptions.series_id=products.series_id WHERE products.date_added = ? AND products.variant = '1' AND products.printing = '1'`;
    const [joinResults] = await pool.execute(joinSql, [formattedDate]);

    const formattedResults = joinResults.map((row) => [row.user_id, row.id]);

    if (formattedResults.length !== 0) {
      const insertSql = `INSERT INTO pulls_list (user_id, product_id) VALUES ?`;
      await pool.query(insertSql, [formattedResults]);
    }
  } catch (err) {
    console.error(err);
  }
}
export async function getUserSubs(req, res) {
  const userId = req.query.id;

  try {
    const sql =
      "SELECT name, series_id FROM series INNER JOIN subscriptions ON series.id = subscriptions.series_id WHERE subscriptions.user_id = ?";
    const [results] = await pool.execute(sql, [userId]);

    if (results.length === 0) {
      return res.status(204).json({ message: "No subscriptions" });
    }
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
