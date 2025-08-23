import pool from "../dbConfig.js";

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
