// Purpose: define /api/analyze-ai multipart endpoint w/ validation.

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { analyzeExcelWithAI } from "../controllers/aiController.js";

const router = express.Router();

// Store uploads in /uploads with unique file name
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const uploadPath = path.join(process.cwd(), "uploads");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Only accept .xls / .xlsx (by filename and mimetype best-effort)
const fileFilter = (_req, file, cb) => {
    const okName = /\.xlsx?$/i.test(file.originalname);
    const okType =
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.mimetype === "application/vnd.ms-excel" ||
        file.mimetype === "application/octet-stream"; // some browsers
    if (okName && okType) return cb(null, true);
    cb(new Error("Only .xls/.xlsx files are allowed"));
};

const upload = multer({
    storage,
    limits: { fileSize: 8 * 1024 * 1024 }, // 8MB guardrail
    fileFilter,
});

// POST /api/analyze-ai
router.post("/analyze-ai", upload.single("file"), analyzeExcelWithAI);

export default router;