import React from 'react';
import './About.css';

export default function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-header">
          <h2>Why FinPlay Bharat?</h2>
          <p className="subtitle">Bridging the financial literacy gap in New India</p>
        </div>

        <div className="crisis-stats">
          <div className="stat-card">
            <h3>77%</h3>
            <p>of Indians lack basic financial literacy</p>
          </div>
          <div className="stat-card">
            <h3>82%</h3>
            <p>of digital fraud victims are aged 18-35</p>
          </div>
          <div className="stat-card">
            <h3>₹50,000</h3>
            <p>Average loss per young adult due to financial mistakes</p>
          </div>
          <div className="stat-card">
            <h3>23%</h3>
            <p>Actual participation in formal investment markets</p>
          </div>
        </div>

        <div className="about-content">
          <div className="about-text">
            <h3>The Financial Literacy Crisis</h3>
            <p>
              Traditional Indian education focuses on high grades but ignores practical life skills. 
              Fresh graduates enter the workforce with their first salary but zero knowledge of 
              taxes, credit scores, or inflation. This leads to poor debt management and makes 
              millions vulnerable to rising digital fraud.
            </p>
            
            <div className="solution-features">
              <div className="sol-item">
                <span className="sol-icon">🎯</span>
                <div>
                  <h4>Personalized Missions</h4>
                  <p>Learn based on your current knowledge levels.</p>
                </div>
              </div>
              <div className="sol-item">
                <span className="sol-icon">⚡</span>
                <div>
                  <h4>Instant Feedback</h4>
                  <p>Mistakes aren't failures; they're simulated learning steps.</p>
                </div>
              </div>
              <div className="sol-item">
                <span className="sol-icon">🏆</span>
                <div>
                  <h4>Reward System</h4>
                  <p>Earn badges and certificates as you master concepts.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-highlights">
            <div className="highlight-pill">🚫 No Real Risk</div>
            <div className="highlight-pill">🎮 Learn by Playing</div>
            <div className="highlight-pill">🇮🇳 Best for Bharat</div>
            <div className="highlight-pill">📱 User Friendly</div>
          </div>
        </div>
      </div>
    </section>
  );
}
