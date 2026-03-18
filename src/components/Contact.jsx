import React from 'react';
import './Contact.css';

export default function Contact() {
  const teamMembers = [
    { name: "Eklavya", role: "AI/ML Lead & Project Manager", icon: "👤" },
    { name: "Dhairya", role: "Full-Stack Development", icon: "👤" },
    { name: "Jainish", role: "Frontend & UX Design", icon: "👤" },
    { name: "Mahir", role: "Backend & Database", icon: "👤" }
  ];

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>📬 Contact Us</h1>
        <p>Get in touch with the FinPlay Bharat team</p>
      </div>

      <div className="contact-card">
        <div className="team-section">
          <h3>Team Members</h3>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-item">
                <span className="member-icon">{member.icon}</span>
                <p><strong>{member.name}</strong> – {member.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="connect-section">
          <h3>Connect</h3>
          <div className="connect-links">
            <div className="connect-item">
              <span className="connect-icon">📧</span>
              <span>Email: <a href="mailto:finplaybharat@gmail.com">finplaybharat@gmail.com</a></span>
            </div>
            <div className="connect-item">
              <span className="connect-icon">🔗</span>
              <span>GitHub: <a href="https://github.com/EklavyajhaAI07/FinPlay-Bharat" target="_blank" rel="noopener noreferrer">github.com/EklavyajhaAI07/FinPlay-Bharat</a></span>
            </div>
            <div className="connect-item">
              <span className="connect-icon">📸</span>
              <span>Instagram: <a href="https://instagram.com/buisness.promoter07" target="_blank" rel="noopener noreferrer">@buisness.promoter07</a></span>
            </div>
          </div>
        </div>

        <div className="contact-footer-note">
          <p>
            FinPlay Bharat is a hackathon-stage educational project developed under the 
            National Centre for Financial Education initiative and powered by H2S.
          </p>
        </div>
      </div>
    </div>
  );
}
