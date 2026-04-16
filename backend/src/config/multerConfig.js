import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";

dotenv.config();

const storage = new GridFsStorage({
  url: process.env.MONGODB_URL,
  file: (req, file) => {
    return {
      bucketName: "bookCovers",
      filename: Date.now() + "-" + file.originalname
    };
  }
});

const upload = multer({ storage });

export default upload;