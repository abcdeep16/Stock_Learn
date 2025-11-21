// routes/sessionRoutes.js
import express from "express";
import { startSession, takeAction } from "../controllers/sessionController.js";

const router = express.Router();

// Start a new session (returns price array + initial state)
// Optionally accept scenario type in body: { scenario: 'crash' }
router.post("/start", startSession);

// User action: { sessionId, action: 'BUY'|'SELL'|'HOLD', quantity }
router.post("/action", takeAction);

export default router;
