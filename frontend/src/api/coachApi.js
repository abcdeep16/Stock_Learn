const API_BASE = "http://localhost:9000";

export const getCoachFeedback = async (payload) => {
  const res = await fetch(`${API_BASE}/api/coach/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let text = "Failed to get coach feedback";
    try {
      const err = await res.json();
      text = err.error || err.message || text;
    } catch (_) {}
    throw new Error(text);
  }
  return res.json(); // returns { coachMessage }
};
