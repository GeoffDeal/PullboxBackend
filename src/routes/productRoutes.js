import express from "express";
import multer from "multer";
import {
  getAllVar,
  getBrowsed,
  getProduct,
  getSearched,
  getSeries,
  postExcel,
} from "../controllers/productController.js";
import { validateFile } from "../utils/validate.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/getproduct/:id", getProduct);
router.get("/browse", getBrowsed);
router.get("/search", getSearched);
router.get("/getvariants", getAllVar);
router.get("/getseries/:id", getSeries);
router.post("/upload", upload.array("file"), validateFile, postExcel);

export default router;
