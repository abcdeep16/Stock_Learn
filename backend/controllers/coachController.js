// controllers/coachController.js
import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || null;
console.log(
  "Loaded OPENAI_API_KEY:",
  OPENAI_API_KEY ? `✅ (length: ${OPENAI_API_KEY.length})` : "❌ Missing"
);

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

/**
 * POST /api/coach/feedback
 * body: { actions, behaviourTags, pnl, summary }
 */
export const getCoachMessage = async (req, res) => {
  const { actions, behaviourTags, pnl, summary } = req.body || {};

  // Validate required fields
  if (!actions || !behaviourTags)
    return res
      .status(400)
      .json({ error: "actions and behaviourTags are required" });

  const prompt = buildPrompt(actions, behaviourTags, pnl, summary);

  if (!OPENAI_API_KEY) {
    console.log("⚠️ OPENAI_API_KEY not found, returning mock response");
    const mock = `Coach: I noticed you ${behaviourTags.join(
      ", "
    )}. Your final P&L was ${pnl ?? "N/A"}. Tip: averaging down can lower average cost but increases exposure to a falling market. Diversify holdings.`;
    return res.json({ coachMessage: mock });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-4" if available
      messages: [
        {
          role: "system",
          content: "You are a friendly investing coach for beginners.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 250,
    });

    const coachText =
      completion.choices?.[0]?.message?.content ?? "Sorry, no response from AI.";

    return res.json({ coachMessage: coachText });
  } catch (err) {
    console.error("Coach API error:", err);
    return res
      .status(500)
      .json({ error: "AI integration failed", details: err.message });
  }
};

/**
 * Build the prompt for the AI coach
 */
function buildPrompt(actions, behaviourTags, pnl, summary) {
  return `You are a friendly, beginner-focused investing coach. Given the user's actions and behaviour tags, provide:
1) A simple concise explanation of what the user did (2-3 lines).
2) 2-3 simple lessons or concepts the user used or missed (e.g., averaging down, FOMO, diversification).
3) One practical tip for next time.
4) Suggest further reading or resources for beginners.

Actions: ${JSON.stringify(actions)}
BehaviourTags: ${behaviourTags.join(", ")}
Final P&L: ${pnl ?? "N/A"}
AdditionalSummary: ${summary ?? "none"}`;
}
