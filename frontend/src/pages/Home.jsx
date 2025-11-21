import React from "react";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="hero-content">
          <h1>
            Learn <span className="green-text">Simulate</span><br />
            Grow..
          </h1>

          <p className="hero-subtitle">
            Apex is a stock market learning lab where you practice trades in
            a simulated market, face real emotions, and get friendly feedback
            from an AI coach – before risking real money.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary">
              Start Demo Trading <i className="fas fa-rocket"></i>
            </button>
            <button className="btn btn-outline">
              Watch 2-min Demo <i className="fas fa-play"></i>
            </button>
          </div>

          <div className="hero-badges">
            <div className="badge">
              <i className="fas fa-file-invoice-dollar"></i>
              <span>Paper trading • No real money</span>
            </div>
            <div className="badge">
              <i className="fas fa-robot"></i>
              <span>AI Behaviour Coach</span>
            </div>
            <div className="badge">
              <i className="fas fa-graduation-cap"></i>
              <span>Beginner-friendly (Hindi + English)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section features">
        <h2 className="section-title">Why learners choose DhanPath?</h2>
        <p className="section-subtitle">
          Real market feel, zero real risk, and clear explanations in simple language.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon green-bg">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>Simulated Stock Market</h3>
            <p>
              Play with dynamic price charts, red-green candles and news-driven
              scenarios that feel like the real market.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon red-bg">
              <i className="fas fa-brain"></i>
            </div>
            <h3>AI Behaviour Coach</h3>
            <p>
              After each session, Apex explains your behaviour – FOMO buying,
              panic selling, averaging down – in simple words.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon green-bg">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3>Risk-free Learning</h3>
            <p>
              Practice as much as you want with virtual money only.
              Make mistakes here, not with your real savings.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section how-it-works">
        <h2 className="section-title">How Apex Works</h2>

        <div className="steps">
          <div className="step">
            <div className="step-number green-border">1</div>
            <h3>Pick a Scenario</h3>
            <p>
              Choose a market situation – mini crash, sideways market,
              sudden rally – and see live-like price movements.
            </p>
          </div>

          <div className="step">
            <div className="step-number red-border">2</div>
            <h3>Make Decisions</h3>
            <p>
              Buy, sell or hold using virtual money. Experience fear and greed
              in a safe environment.
            </p>
          </div>

          <div className="step">
            <div className="step-number green-border">3</div>
            <h3>Get AI Feedback</h3>
            <p>
              At the end, our AI coach breaks down what you did and teaches
              2–3 core concepts like diversification, FOMO, risk management.
            </p>
          </div>
        </div>
      </section>

      {/* For Whom Section */}
      <section id="for-whom" className="section for-whom">
        <h2 className="section-title">Apex is perfect for…</h2>

        <div className="for-grid">
          <div className="for-card">
            <h3>Students & Freshers</h3>
            <p>
              Who want to understand markets before starting their first SIP or
              stock purchase.
            </p>
          </div>

          <div className="for-card">
            <h3>New Investors</h3>
            <p>
              Who fear losing money but still want to build wealth through equities.
            </p>
          </div>

          <div className="for-card">
            <h3>Hackathon / Project Demos</h3>
            <p>
              Showcase AI + finance skills with a visual, interactive learning tool.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-left">
            <span className="logo-text">Ap<span>ex</span></span>
            <p>Learn. Simulate. Grow – before you invest real money.</p>
          </div>
          <div className="footer-right">
            <span>Made for learners across India 🇮🇳</span>
          </div>
        </div>

        <div className="copyright">
          &copy; 2025 Apex. All rights reserved.
        </div>
      </footer>
    </>
  );
}
