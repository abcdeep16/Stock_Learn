import React from "react";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-logo">
        <span className="logo-mark">₹</span>
        <span className="logo-text">
          Ap<span>ex</span>
        </span>
      </div>

      <nav className="nav-links">
        <a href="#hero">Home</a>
        <a href="#features">Why Apex</a>
        <a href="#how-it-works">How it Works</a>
        <a href="#for-whom">For Whom</a>
      </nav>

      <div className="nav-actions">
        <button className="btn btn-ghost">Log in</button>
        <button className="btn btn-primary">Start Free Lab</button>
      </div>
    </header>
  );
}
