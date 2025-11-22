# 📈 Stock Market Learning Lab

A beginner-friendly Stock Market Learning Lab where users simulate market scenarios and receive AI-generated coaching feedback based on their behaviour, actions, and P&L. The goal is to teach investing concepts through interactive learning rather than reading long theory.

---

## 🚀 Overview

This project includes:

### Backend (Node + Express)
- API endpoint /api/coach/feedback
- Takes user actions, behaviour tags, P&L, and summary
- Generates a coaching message using an AI model (HuggingFace or mock response)
- Simple, modular, and hackathon-ready

### Frontend (React + TailwindCSS)
- Clean and modern UI using project colors:
  - #00c853 (Green)
  - #ff3b30 (Red)
  - #050608 (Dark)
- Form to send simulation results to backend
- Displays AI feedback in a chat-style UI

---

## 📁 Project Structure

```
project/
│
├── backend/
│   ├── controllers/
│   │   └── coachController.js
│   ├── routes/
│   │   └── coachRoutes.js
│   ├── index.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    ├── package.json
    └── index.html
```
---

# ⚙️ Backend Setup

### 1️⃣ Install dependencies
```bash
cd backend
npm install

2️⃣ Create .env
PORT=9000
HF_API_KEY=your_huggingface_api_key_here

3️⃣ Run Development Server
npm run dev

Backend runs at:
http://localhost:9000


🧠 API Documentation
POST /api/coach/feedback
Request Body
{
  "actions": [
    { "action": "BUY", "price": 120, "qty": 2 }
  ],
  "behaviourTags": ["FOMO", "Averaging Down"],
  "pnl": -230,
  "summary": "Bought aggressively after a spike"
}

Response Example
{
  "coachMessage": "Here's what I noticed about your trading behaviour..."
}

🧪 Testing With Postman
Open Postman → POST
URL: http://localhost:9000/api/coach/feedback
Body → raw → JSON:
{
  "actions": [{"action":"BUY","price":120,"qty":2}],
  "behaviourTags": ["FOMO","Overconfidence"],
  "pnl": -50,
  "summary": "User bought at peak"
}

💻 Frontend Setup
1️⃣ Install Dependencies
cd frontend
npm install

2️⃣ Run React App
npm run dev

Frontend runs at:
http://localhost:5173


🔌 Connecting Frontend to Backend
Frontend uses:
const response = await fetch("http://localhost:9000/api/coach/feedback", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ actions, behaviourTags, pnl, summary })
});

Backend returns the AI message → shown inside UI.

🎨 Color Palette
PurposeColorPrimary Green#00c853Loss Red#ff3b30Background Dark#050608

✨ Features
AI-generated beginner-friendly guidance
Clean UI with your custom colors
REST API backend
Trade simulation inputs
Behaviour-based insights
Perfect for hackathons

📦 Deployment
Frontend Build
npm run build

Backend Deployment Options
Render
Railway
Vercel serverless
AWS EC2
Netlify (only frontend)

📌 Future Enhancements
Authentication
Save trading history
Multi-scenario simulations
Gamification (XP, badges)
More advanced AI coaching


📜 License
MIT License © 2025

🤝 Contributing
PRs and issues are welcome.
