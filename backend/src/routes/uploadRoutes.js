import express from "express";
import upload from "../config/multerConfig.js";
import {
  uploadBookCover,
  getBookCover,
  deleteBookCover
} from "../controllers/uploadController.js";

const router = express.Router();

// Upload
router.post("/book-cover", upload.single("coverImage"), uploadBookCover);

// IMAGE ROUTE
router.get("/image/:fileId", (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, getBookCover);

// Delete
router.delete("/image/:fileId", deleteBookCover);

export default router;