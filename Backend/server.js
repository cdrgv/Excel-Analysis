import "./config/env.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connect } from "mongoose";

import authRoutes from "./routes/auth.js";
import uploadRoute from "./routes/uploadRoute.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* ===========================
   ✅ MIDDLEWARE
=========================== */

// Parse JSON
app.use(express.json());

// Parse Cookies
app.use(cookieParser());

// CORS Configuration (Allow All Origins + Credentials)
app.use(
  cors({
    origin: true,   // dynamically allow all origins
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ===========================
   ✅ TEST ROUTE
=========================== */

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working 🚀" });
});

/* ===========================
   ✅ ROUTES
=========================== */

app.use("/api/auth", authRoutes);
app.use("/api/files", uploadRoute);
app.use("/api", aiRoutes);

/* ===========================
   ✅ 404 HANDLER
=========================== */

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ===========================
   ✅ DATABASE + SERVER
=========================== */

connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error ❌:", err);
  });
