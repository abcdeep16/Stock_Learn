// controllers/coachController.js
import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("API Key loaded:", process.env.GEMINI_API_KEY ? "✓ Yes" : "✗ No");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getCoachMessage = async (req, res) => {
  const { actions, behaviourTags, pnl, summary } = req.body || {};

  if (!actions || !behaviourTags)
    return res.status(400).json({ error: "actions and behaviourTags required" });

  // 👇 BUILD THE PROMPT HERE
  const prompt = buildPrompt(actions, behaviourTags, pnl, summary);

  // If API key missing -> mock
  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      coachMessage: `Coach: I noticed you ${behaviourTags.join(", ")}...`
    });
  }

  try {
    // 👇 Initialize Gemini Model
    const model = genAI.getGenerativeModel({ model: "text-bison-1" });

    // 👇 PASS THE PROMPT HERE
    const result = await model.generateContent(prompt);

    const text = result.response.text();

    return res.json({ coachMessage: text });
  } catch (err) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({
      error: "AI integration failed",
      details: err?.message
    });
  }
};

// =======================
function buildPrompt(actions, behaviourTags, pnl, summary) {
  return `
You are a friendly, beginner-focused investing coach.

Actions: ${JSON.stringify(actions)}
BehaviourTags: ${behaviourTags.join(", ")}
Final P&L: ${pnl ?? "N/A"}
Additional Summary: ${summary ?? "none"}

Provide:
1. thprough professional explanation What the user did well or poorly  
2. Lessons they used or missed  
3. A simple tip for next time  
4. Resources to learn more  
`;
}
