import {
  transformProduct,
  transformWeeksPulls,
} from "../datatransformers/productTransformers.js";
import pool from "../dbConfig.js";
import { calcSunday, calcWeekEnd } from "../utils/timeFunctions.js";
import { clerkClient } from "@clerk/express";

export async function addPull(req, res) {
  const { userId, productId } = req.body;

  try {
    const values = [userId, productId];
    const sql = `INSERT IGNORE INTO pulls_list (user_id, product_id) VALUES (?, ?)`;

    await pool.execute(sql, values);

    const getSql = `SELECT id, amount FROM pulls_list WHERE user_id = ? AND product_id = ?`;
    const [result] = await pool.execute(getSql, values);

    if (result.length === 0) {
      return res.status(404).json({ error: "Could not find new pull" });
    }
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
  const { userId, productId } = req.query;

  try {
    const sql = `SELECT id, amount FROM pulls_list WHERE user_id = ? AND product_id = ?`;
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
  const weekEnd = calcWeekEnd(releaseSunday);

  try {
    const sql = `SELECT pulls_list.*, pulls_list.id AS pulls_list_id, products.* FROM products INNER JOIN pulls_list ON products.id = pulls_list.product_id WHERE pulls_list.user_id = ? AND products.release_date >= ? AND products.release_date < ?`;
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
  const { release, foc } = req.query;

  const dateType = release ? "products.release_date" : "products.foc_due_date";

  const date = release || foc;
  const weekStart = calcSunday(date);
  const weekEnd = calcWeekEnd(weekStart);

  try {
    const sql = `
      SELECT pulls_list.*, pulls_list.id AS pulls_list_id, 
            products.*, products.id AS product_id, users.id AS user_id, users.box_number 
      FROM products 
      INNER JOIN pulls_list ON products.id = pulls_list.product_id 
      INNER JOIN users ON pulls_list.user_id = users.id 
      WHERE ${dateType} >= ? 
        AND ${dateType} < ? 
        AND users.status = 'active'
      `;

    const [results] = await pool.execute(sql, [weekStart, weekEnd]);

    if (results.length === 0) return res.status(204).send();

    const userIds = [...new Set(results.map((r) => r.id))];

    const chunkedIds = (arr, size) =>
      Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
      );

    const clerkUsers = [];
    for (const chunk of chunkedIds(userIds, 100)) {
      const clerkRes = await clerkClient.users.getUserList({
        userId: chunk,
        limit: 100,
      });
      clerkUsers.push(...clerkRes.data);
    }

    const userMap = {};
    clerkUsers.forEach((user) => {
      userMap[user.id] = user.firstName + " " + user.lastName;
    });
    const formattedResults = results.map((product) => {
      const name = userMap[product.id] || "Unknown User";
      return transformWeeksPulls(product, name);
    });

    return res.status(200).json(formattedResults);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
