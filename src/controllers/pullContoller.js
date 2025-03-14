import { transformProduct } from "../datatransformers/productTransformers.js";
import pool from "../dbConfig.js";
import { calcSunday } from "../utils/timeFunctions.js";

export async function addPull(req, res) {
  const { userId, productId } = req.body;
  console.log(userId, productId);

  try {
    const values = [userId, productId];
    const sql = `INSERT IGNORE INTO pulls_list (user_id, product_id) VALUES (?, ?)`;

    const [result] = await pool.execute(sql, values);

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function changePullAmount(req, res) {
  const pullId = req.params.id;
  const amount = req.body.amount;

  try {
    const values = [amount, pullId];
    const sql = `UPDATE pulls_list SET amount = ? WHERE id = ?`;

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
  const pullId = req.params.id;

  try {
    const sql = `DELETE FROM pulls_list WHERE id = ?`;

    const [result] = await pool.execute(sql, [pullId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No matching pull to remove" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function checkPull(req, res) {
  const { userId, productId } = req.body;

  try {
    const sql = `SELECT id FROM pulls_list WHERE user_id = ? AND product_id = ?`;
    const [result] = await pool.execute(sql, [userId, productId]);

    if (result.length !== 0) {
      return res.status(200).json(result);
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getUserPulls(req, res) {
  const { userId, release } = req.query;

  const releaseSunday = calcSunday(release);
  const weekEnd = new Date(releaseSunday);
  weekEnd.setDate(weekEnd.getDate() + 7);

  try {
    const sql = `SELECT * FROM products INNER JOIN pulls_list ON products.id = pulls_list.product_id WHERE pulls_list.user_id = ? AND products.release_date >= ? AND products.release_date < ?`;
    const [results] = await pool.execute(sql, [userId, releaseSunday, weekEnd]);

    if (results.length !== 0) {
      const formattedResults = results.map((product) =>
        transformProduct(product)
      );
      return res.status(200).json(formattedResults);
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getWeeksPulls(req, res) {
  const release = req.query.release;

  try {
    const sql = `SELECT * FROM products INNER JOIN pulls_list ON products.id = pulls_list.product_id WHERE products.release_date= ?`;
    const [results] = await pool.execute(sql, [release]);

    if (results.length !== 0) {
      const formattedResults = results.map((product) =>
        transformProduct(product)
      );
      return res.status(200).json(formattedResults);
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
