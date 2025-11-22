import { useEffect, useState } from "react";
import { getCoachFeedback } from "../api/coachApi";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

export default function ResultsPage() {
  const { state } = useLocation();
  const [coach, setCoach] = useState("");
  const [loadingCoach, setLoadingCoach] = useState(false);
  const navigate = useNavigate();

  // If this page was opened without session state (user refreshed or navigated directly), redirect home
  useEffect(() => {
    if (!state) {
      // small timeout to allow any in-flight navigations to settle
      const t = setTimeout(() => navigate("/"), 50);
      return () => clearTimeout(t);
    }
  }, [state, navigate]);

  // Render coach message with simple formatting:
  // - Preserves paragraphs separated by double newlines
  // - Preserves single newlines as <br />
  // - Renders simple bulleted (- or *) and numbered lines as lists
  const renderCoachMessage = (text) => {
    if (!text) return null;

    // Normalize line endings
    const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    // Split into blocks separated by blank lines
    const blocks = normalized.split(/\n\s*\n/);

    return blocks.map((block, bi) => {
      const lines = block
        .split(/\n+/)
        .map((l) => l.trim())
        .filter(Boolean);
      // detect bullet list (all lines start with - or *)
      const isBulleted =
        lines.length > 0 && lines.every((l) => /^[-*]\s+/.test(l));
      const isNumbered =
        lines.length > 0 && lines.every((l) => /^\d+[.)]\s+/.test(l));

      if (isBulleted) {
        return (
          <ul key={bi} className="list-disc list-inside text-gray-200 mb-3">
            {lines.map((l, i) => (
              <li key={i}>{l.replace(/^[-*]\s+/, "")}</li>
            ))}
          </ul>
        );
      }

      if (isNumbered) {
        return (
          <ol key={bi} className="list-decimal list-inside text-gray-200 mb-3">
            {lines.map((l, i) => (
              <li key={i}>{l.replace(/^\d+[.)]\s+/, "")}</li>
            ))}
          </ol>
        );
      }

      // Otherwise render as paragraph with preserved line breaks
      return (
        <p key={bi} className="text-white leading-relaxed mb-3">
          {lines.map((ln, idx) => (
            // insert <br/> between lines
            <span key={idx}>
              {ln}
              {idx < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      );
    });
  };

  // Preprocess AI text: unescape common escapes so Markdown renders correctly
  const preprocessCoach = (text) => {
    if (!text) return text;
    let s = String(text);
    // Unescape backslash-escaped asterisks or underscores (e.g. "\*\*demo\*\*")
    s = s.replace(/\\\*/g, "*").replace(/\\_/g, "_");
    // Unescape HTML entities that might have been encoded
    s = s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    // If model returned literal '**word**' with spaces (e.g. "** demo **"), normalize spacing
    s = s.replace(/\*\*\s+([^\*]+?)\s+\*\*/g, "**$1**");
    return s;
  };

  useEffect(() => {
    async function fetchFeedback() {
      const payload = {
        actions: state.actions,
        behaviourTags: state.behaviourTags,
        pnl: state.portfolio.realizedPnl,
        summary: "User performance summary",
      };
      setLoadingCoach(true);
      try {
        const data = await getCoachFeedback(payload);
        // API returns { coachMessage }
        setCoach(data.coachMessage || data.message || "No feedback available.");
      } catch (err) {
        console.error("Failed to get coach feedback", err);
        setCoach(
          "Coach feedback unavailable right now. Please try again later."
        );
      } finally {
        setLoadingCoach(false);
      }
    }
    fetchFeedback();
  }, [state]);

  return (
    <div className="min-h-screen bg-brandDark text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Your Simulation Summary</h1>

      <div
        className="bg-white/10 backdrop-blur-xl border border-white/10 p-6
        rounded-2xl shadow-soft mb-8"
      >
        <p className="text-gray-300 text-sm">Final P&L</p>
        <p className="text-4xl font-bold text-brandGreen">
          ₹{state.portfolio.realizedPnl}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-1">Your Behaviours</h3>
        <p className="text-gray-300">{state.behaviourTags.join(", ")}</p>
      </div>

      <div
        className="bg-brandGreen/10 text-brandGreen border border-brandGreen/30
        p-6 rounded-2xl shadow-soft"
      >
        <h2 className="font-semibold text-2xl mb-2">Coach Feedback</h2>

        {loadingCoach ? (
          <div className="flex items-center gap-3 text-gray-200">
            <svg
              className="w-6 h-6 text-brandGreen animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                className="opacity-20"
              />
              <path
                d="M22 12a10 10 0 00-10-10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div>
              <div className="font-medium">
                Coach is evaluating your session…
              </div>
              <div className="text-sm text-gray-300">
                This may take a few seconds.
              </div>
            </div>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            {/* Prefer Markdown rendering when AI returns markdown-like text (e.g. **bold**, lists) */}
            <ReactMarkdown
              rehypePlugins={[rehypeSanitize]}
              components={{
                // style bold text green
                strong: ({ node, ...props }) => (
                  <strong
                    className="text-brandGreen font-semibold"
                    {...props}
                  />
                ),
                em: ({ node, ...props }) => (
                  <em className="text-gray-200 italic" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-white leading-relaxed" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="text-gray-200 mb-1" {...props} />
                ),
              }}
            >
              {preprocessCoach(coach)}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
