import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("User stuff here");
});
export default router;
