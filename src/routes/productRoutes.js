import express from "express";
import {
  getBrowsed,
  getProduct,
  getSearched,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/getproduct/:id", getProduct);
router.get("/browse", getBrowsed);
router.get("/search", getSearched);

export default router;
