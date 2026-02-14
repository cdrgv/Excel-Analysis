import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import Upload from "../models/Upload.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// ✅ Stable uploads path
const uploadPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Multer config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadPath),
  filename: (_req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`)
});

const fileFilter = (_req, file, cb) => {
  const isExcel =
    file.mimetype === "application/vnd.ms-excel" ||
    file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  if (!isExcel) return cb(new Error("Only Excel files are allowed (.xls, .xlsx)"));
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

// ✅ Upload with proper error handling
router.post(
  "/upload",
  authMiddleware,
  (req, res, next) => {
    upload.single("file")(req, res, err => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const { originalname, size, mimetype } = req.file;

      const newUpload = new Upload({
        filename: originalname,
        size,
        mimetype,
        user: req.user.userId,
      });

      await newUpload.save();

      res.status(200).json({
        message: "File uploaded and saved to history",
        file: originalname,
      });
    } catch (err) {
      console.error("Upload DB save error:", err);
      res.status(500).json({ message: "Failed to save upload info" });
    }
  }
);

// ✅ History route
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const uploads = await Upload.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .select("filename size mimetype createdAt");

    res.json({ uploads });
  } catch (err) {
    console.error("Error fetching upload history:", err);
    res.status(500).json({ message: "Failed to fetch upload history" });
  }
});

export default router;
