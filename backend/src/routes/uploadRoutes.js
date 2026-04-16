import express from "express";
import upload from "../config/multerConfig.js";
import {
  uploadBookCover,
  getBookCover,
  deleteBookCover
} from "../controllers/uploadController.js";

const router = express.Router();

// Upload book image
router.post("/book-cover", upload.single("coverImage"), uploadBookCover);

// Get book image
router.get("/image/:fileId", getBookCover);

// Delete image
router.delete("/image/:fileId", deleteBookCover);

export default router;