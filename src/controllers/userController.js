import pool from "../dbConfig.js";
import { clerkClient } from "@clerk/express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { transformUser } from "../datatransformers/userTransformer.js";

export async function getAllCustomers(req, res) {
  try {
    const [pbUsers] = await pool.execute("SELECT * FROM users");

    const pbUserMap = new Map();
    pbUsers.forEach((pbUser) => {
      pbUserMap.set(pbUser.id, pbUser);
    });

    const allClerkUsers = [];
    const limit = 100;
    let offset = 0;
    let done = false;
    while (!done) {
      const clerkRes = await clerkClient.users.getUserList({ limit, offset });
      allClerkUsers.push(...clerkRes.data);
      if (clerkRes.data.length < limit) {
        done = true;
      } else {
        offset += limit;
      }
    }

    const formattedUsers = allClerkUsers
      .map((clerkUser) => {
        const pbUser = pbUserMap.get(clerkUser.id);
        if (!pbUser) return null;
        return transformUser(clerkUser, pbUser);
      })
      .filter(Boolean);

    res.status(200).json(formattedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Problem fetching customers" });
  }
}

export async function getOneUser(req, res) {
  try {
    const userId = req.params.id;
    const [pbUser] = await pool.execute("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
    const clerkUser = await clerkClient.users.getUser(userId);
    const formattedUser = transformUser(clerkUser, pbUser[0]);
    res.status(200).json(formattedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Problem fetching customer" });
  }
}

export async function createUser(req, res) {
  try {
    const verified = await verifyWebhook(req);
    const userValues = [verified.data.id, "pending"];

    const [result] = await pool.execute(
      "INSERT INTO users (id, status) VALUES (?, ?)",
      userValues
    );
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to create user: ", error: err.message });
  }
}

export async function changeUserStatus(req, res) {
  const userId = req.params.id;
  const newStatus = req.body.status;
  try {
    const sql = `UPDATE users SET status = ? WHERE id = ?`;
    const [result] = await pool.execute(sql, [newStatus, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User status updated" });
  } catch (err) {
    console.error("Error updating status: ", err);
    res.status(500).json({ error: "Internal server error " });
  }
}

export async function changeUserBox(req, res) {
  const userId = req.params.id;
  const newNumber = req.body.boxNumber;
  try {
    const sql = `UPDATE users SET box_number = ? WHERE id = ?`;
    const [result] = await pool.execute(sql, [newNumber, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User status updated" });
  } catch (err) {
    console.error("Error updating status: ", err);
    res.status(500).json({ error: "Internal server error " });
  }
}

export async function updateUser(req, res) {
  const userId = req.params.id;
  const updates = req.body;

  const allowedFields = ["name", "email", "box_number", "phone"];
  const fieldsToUpdate = Object.keys(updates).filter((field) =>
    allowedFields.includes(field)
  );

  if (fieldsToUpdate.length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  try {
    const sets = fieldsToUpdate.map((field) => `\`${field}\` = ?`).join(", ");
    const values = fieldsToUpdate.map((field) => updates[field]);
    const sql = `UPDATE users SET ${sets} WHERE id =?`;

    const [result] = await pool.execute(sql, [...values, userId]);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
