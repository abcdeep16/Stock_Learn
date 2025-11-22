const API_BASE = "http://localhost:9000";

export const startSession = async (scenario) => {
  const res = await fetch(`${API_BASE}/api/session/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario }),
  });

  if (!res.ok) throw new Error("Failed to start session");
  return res.json(); // returns { sessionId }
};

export const takeAction = async (sessionId, action, qty) => {
  const res = await fetch(`${API_BASE}/api/session/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, action, qty }),
  });

  if (!res.ok) throw new Error("Failed to process action");
  return res.json(); // returns updated state
};
