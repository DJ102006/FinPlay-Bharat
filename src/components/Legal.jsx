import React from 'react';
import { useLocation } from 'react-router-dom';
import './Legal.css';

export default function Legal() {
  const location = useLocation();
  const path = location.pathname;

  const getContent = () => {
    if (path.includes('privacy')) {
      return (
        <div className="legal-content">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last updated: February 2026</p>
          <h2>1. Information We Collect</h2>
          <p>We collect personal information including: Name, Email address, Age, and Language preferences. Usage data such as quiz scores, progress, and certificates is also collected.</p>
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To provide personalized learning experiences</li>
            <li>To track your progress and generate certificates</li>
            <li>To improve our platform and content</li>
            <li>To send important platform updates</li>
          </ul>
          <h2>3. Data Storage & Security</h2>
          <p>All data is encrypted at rest using AES-256 encryption. Passwords are hashed using bcrypt with 12 salt rounds. We use HTTPS for all data transmission and JWT tokens for authentication.</p>
          <h2>4. Data Sharing</h2>
          <p>We do NOT sell your personal data. We do NOT share your data with third parties for marketing. Data may be shared only when required by law.</p>
        </div>
      );
    } else if (path.includes('terms')) {
      return (
        <div className="legal-content">
          <h1>Terms of Service</h1>
          <p className="last-updated">Last updated: February 2026</p>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using FinPlay Bharat, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          <h2>2. Description of Service</h2>
          <p>FinPlay Bharat is an educational platform providing gamified financial literacy content. All simulations, virtual currencies, and financial games are for educational purposes only and do not constitute actual financial advice.</p>
          <h2>3. User Responsibilities</h2>
          <ul>
            <li>Provide accurate account information</li>
            <li>Maintain account security</li>
            <li>Use the platform for lawful, educational purposes</li>
            <li>Not interfere with platform security or operations</li>
          </ul>
          <h2>4. Intellectual Property</h2>
          <p>All content, designs, and gamified logic are the property of FinPlay Bharat. Users may use content for personal, non-commercial educational purposes only.</p>
        </div>
      );
    } else if (path.includes('gdpr')) {
      return (
        <div className="legal-content">
          <h1>GDPR Compliance</h1>
          <p className="last-updated">Our commitment to data protection</p>
          <h2>Data Protection Principles</h2>
          <p>FinPlay Bharat processes personal data in accordance with GDPR principles: lawfulness, fairness, transparency, purpose limitation, data minimization, accuracy, storage limitation, and security.</p>
          <h2>Legal Basis for Processing</h2>
          <ul>
            <li><strong>Consent:</strong> Account creation and data processing</li>
            <li><strong>Contract:</strong> Delivering platform services</li>
            <li><strong>Legitimate Interest:</strong> Platform improvement and security</li>
          </ul>
          <h2>Your GDPR Rights</h2>
          <ul>
            <li><strong>Right to Access:</strong> Request a copy of your data</li>
            <li><strong>Right to Rectification:</strong> Correct inaccurate data</li>
            <li><strong>Right to Erasure:</strong> Request complete data deletion</li>
            <li><strong>Right to Data Portability:</strong> Receive your data in machine-readable format</li>
          </ul>
        </div>
      );
    }
    return <h1>Page Not Found</h1>;
  };

  return (
    <div className="legal-page">
      <div className="legal-container">
        {getContent()}
      </div>
    </div>
  );
}
