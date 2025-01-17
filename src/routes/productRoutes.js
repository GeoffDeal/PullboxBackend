// Imports
import express from "express";
import getAllProduct from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProduct);
export default router;
