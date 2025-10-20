import express from "express";
import multer from "multer";
import { rateMyResume, getBulletPoints } from "./gemini.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Give it a timestamp to avoid collisions
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/get-content", getBulletPoints);

router.post("/rate-resume", upload.single("file"), rateMyResume);

export default router;
