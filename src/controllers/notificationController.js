import pool from "../dbConfig.js";
import { Notification } from "../models/notificationModel.js";

export async function createNotification(req, res) {
  const notification = new Notification(req.body);
  const formattedData = notification.arrayFormat();

  try {
    const sql = `INSERT INTO notifications (title, body, image_url) VALUES (?, ?, ?)`;
    const [results] = await pool.execute(sql, formattedData);

    res.status(201).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteNotification(req, res) {
  const notificationId = req.params.id;

  try {
    const sql = `DELETE FROM notifications WHERE id = ?`;
    const [results] = await pool.execute(sql, [notificationId]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getRecentNotifications(req, res) {
  try {
    const [results] = await pool.execute(
      `SELECT * FROM notifications WHERE date >= NOW() - INTERVAL 2 MONTH`
    );

    if (results.length !== 0) {
      return res.status(200).json(results);
    }
    res.status(204).json({ message: "No notifications found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
