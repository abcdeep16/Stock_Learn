// routes/coachRoutes.js
import express from "express";
import { getCoachMessage } from "../controllers/coachController.js";

const router = express.Router();

// Send summary, tags, pnl => AI returns coachMessage
router.post("/feedback", getCoachMessage);

export default router;
