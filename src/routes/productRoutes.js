import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Excel handling here");
});
export default router;
