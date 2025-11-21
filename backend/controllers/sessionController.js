// controllers/sessionController.js
import { generateScenario, getScenarioByName } from "../utils/priceScenario.js";
import { initPortfolio, applyAction } from "../utils/portfolioEngine.js";
import { tagBehaviours } from "../utils/behaviourLogic.js";
import { v4 as uuidv4 } from "uuid";

// In-memory sessions (MVP). For production, use DB.
const SESSIONS = new Map();

/**
 * POST /api/session/start
 * body: { scenario?: 'crash'|'rally'|'volatile' } optional
 */
export const startSession = (req, res) => {
  const { scenario = "crash" } = req.body || {};
  const priceArray = generateScenario(scenario);
  const sessionId = uuidv4();

  const session = {
    id: sessionId,
    scenario,
    prices: priceArray,
    step: 0,              // index into prices
    actions: [],          // { step, price, action, quantity }
    portfolio: initPortfolio(priceArray[0])
  };

  SESSIONS.set(sessionId, session);

  return res.json({
    sessionId,
    scenario,
    price: priceArray[0],
    step: 0,
    portfolio: session.portfolio,
    remainingSteps: priceArray.length - 1
  });
};

/**
 * POST /api/session/action
 * body: { sessionId, action: 'BUY'|'SELL'|'HOLD', quantity }
 */
export const takeAction = (req, res) => {
  const { sessionId, action, quantity = 1 } = req.body || {};
  if (!sessionId || !action) return res.status(400).json({ error: "sessionId and action required" });

  const session = SESSIONS.get(sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  const currentPrice = session.prices[session.step];

  // Apply the action to portfolio (mutates session.portfolio)
  const result = applyAction(session.portfolio, action, quantity, currentPrice);

  // Record action
  session.actions.push({
    step: session.step,
    price: currentPrice,
    action,
    quantity,
    timestamp: Date.now()
  });

  // Advance step (if possible)
  if (session.step < session.prices.length - 1) session.step += 1;
  const nextPrice = session.prices[session.step];

  // Behaviour tags (simple)
  const behaviourTags = tagBehaviours(session);

  // If finished, calculate final summary
  const finished = session.step === session.prices.length - 1;

  return res.json({
    sessionId: session.id,
    step: session.step,
    price: nextPrice,
    portfolio: session.portfolio,
    actionResult: result,
    behaviourTags,
    finished,
    actions: session.actions
  });
};
