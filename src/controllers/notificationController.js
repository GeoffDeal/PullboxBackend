import pool from "../dbConfig.js";
import { Notification } from "../models/notificationModel.js";

export async function createNotification(req, res) {
  const notification = new Notification(req.body);
  const formattedData = notification.arrayFormat();
  console.log(formattedData);

  try {
    const sql = `INSERT INTO notifications (title, body, image_url) VALUES (?, ?, ?)`;
    const [results] = await pool.execute(sql, formattedData);

    res.status(201).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
