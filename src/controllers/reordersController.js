import pool from "../dbConfig.js";
import { transformReorder } from "../datatransformers/reorderTransformer.js";
import { clerkClient } from "@clerk/express";

export async function addReorder(req, res) {
  const {
    userId,
    userName,
    product,
    notes,
    orderDate,
    requestDate,
    orderStatus,
  } = req.body;

  try {
    const sql = `
            INSERT INTO reorders (
                user_id,
                user_name,
                product,
                notes,
                order_date,
                request_date,
                order_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
    const values = [
      userId,
      userName,
      product,
      notes,
      orderDate,
      requestDate,
      orderStatus,
    ];

    const [result] = await pool.execute(sql, values);

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Reorder not created: ", error: err.message });
  }
}

export async function getReorders(req, res) {
  try {
    const sql = `SELECT * FROM reorders WHERE order_status <> 'complete'`;
    const [results] = await pool.execute(sql);
    const userIds = results.map((result) => result.user_id);

    const users = await clerkClient.users.getUserList({
      userId: userIds,
    });

    const userMap = new Map(
      users.data.map((user) => [
        user.id,
        [user.firstName, user.lastName].filter(Boolean).join(" "),
      ])
    );

    const combinedData = results.map((result) => {
      const userName = result.user_id
        ? userMap.get(result.user_id) || "Unknown User"
        : result.user_name;

      return {
        ...result,
        ...(userName && { userName }),
      };
    });

    const transformedResults = combinedData.map(transformReorder);

    res.status(200).json(transformedResults);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Problem fetching reorders: ", error: err.message });
  }
}

export async function getCustomerReorders(req, res) {
  try {
    const sql = `SELECT * FROM reorders WHERE user_id = ?`;
    const [results] = await pool.execute(sql, [req.params.id]);

    if (results.length === 0) {
      return res.status(200).json([]);
    }

    const transformedResults = results.map(transformReorder);
    res.status(200).json(transformedResults);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Problem fetching reorders: ", error: err.message });
  }
}

export async function changeReorderStatus(req, res) {
  const reorderId = req.params.id;
  const newStatus = req.body.orderStatus;
  try {
    const sql = `UPDATE reorders SET order_status = ? WHERE id = ?`;
    const [result] = await pool.execute(sql, [newStatus, reorderId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Reorder not found" });
    }

    res.status(200).json({ message: "Reorder status updated" });
  } catch (err) {
    console.error("Error updating status: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
