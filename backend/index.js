// index.js
import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import sessionRoutes from "./routes/sessionRoutes.js";
import coachRoutes from "./routes/coachRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/session", sessionRoutes);
app.use("/api/coach", coachRoutes);

// Health
app.get("/", (req, res) => res.send("Stock Learning Lab backend running"));

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));