import pool from "../dbConfig.js";
import { transformReorder } from "../datatransformers/reorderTransformer.js";
import { clerkClient } from "@clerk/express";

export async function addReorder(req, res) {
  const { userId, product, notes, orderDate, requestDate, orderStatus } =
    req.body;

  try {
    const sql = `
            INSERT INTO reorders (
                user_id,
                product,
                notes,
                order_date,
                request_date,
                order_status
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;
    const values = [
      userId,
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

    console.log(users);

    const userMap = new Map(
      users.data.map((user) => [
        user.id,
        [user.firstName, user.lastName].filter(Boolean).join(" "),
      ])
    );

    const combinedData = results.map((result) => ({
      ...result,
      userName: userMap.get(result.user_id) || "Unknown User",
    }));

    const transformedResults = combinedData.map(transformReorder);

    res.status(200).json(transformedResults);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Problem fetching reorders: ", error: err.message });
  }
}
