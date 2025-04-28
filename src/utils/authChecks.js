import { clerkClient } from "@clerk/express";

export function checkSignIn(req, res, next) {
  const { userId } = req.auth;

  if (!userId) {
    return res.status(401).json({ error: "No user" });
  }

  next();
}

export async function checkAdmin(req, res, next) {
  const { userId } = req.auth;

  if (!userId) {
    return res.status(401).json({ error: "No user" });
  }

  try {
    const user = await clerkClient.users.getUser(userId);

    if (user.publicMetadata.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  } catch (err) {
    console.error("Error fetcing user from Clerk: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
