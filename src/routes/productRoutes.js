import express from "express";
import multer from "multer";
import {
  getAllVar,
  getBrowsed,
  getProduct,
  getSearched,
  getSeries,
  getSeriesBooks,
  postExcel,
} from "../controllers/productController.js";
import { validateFile } from "../utils/validate.js";
import { checkAdmin } from "../utils/authChecks.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/getproduct/:id", getProduct);
router.get("/browse", getBrowsed);
router.get("/search", getSearched);
router.get("/getvariants", getAllVar);
router.get("/getseries/:id", getSeries);
router.get("/getseriesbooks/:id", getSeriesBooks);
router.post("/upload", upload.any(), checkAdmin, validateFile, postExcel);

export default router;
