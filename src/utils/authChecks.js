import { verifyToken } from "@clerk/express";

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or malformed token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verfication = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    req.auth = verfication;
    next();
  } catch (err) {
    console.error("Auth failure: ", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export async function checkAdmin(req, res, next) {
  const role = req.auth.publicMetadata.role;

  if (role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
}
