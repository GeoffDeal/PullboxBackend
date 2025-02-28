import express from "express";
import { getBrowsed, getProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/getproduct/:id", getProduct);
router.get("/browse/:week/:date/:product/:publisher", getBrowsed);

export default router;
