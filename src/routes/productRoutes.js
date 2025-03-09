import express from "express";
import multer from "multer";
import {
  getBrowsed,
  getProduct,
  getSearched,
  postExcel,
} from "../controllers/productController.js";
import { validateFile } from "../utils/validate.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/getproduct/:id", getProduct);
router.get("/browse", getBrowsed);
router.get("/search", getSearched);
router.post("/upload", upload.array("file"), validateFile, postExcel);

export default router;
