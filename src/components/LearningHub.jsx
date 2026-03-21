import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './LearningHub.css';
import { apiUrl } from '../lib/api';
import { getAuthToken, getStoredUser } from '../lib/auth';

const HUB_CONTENT = {
  security: {
    title: "Security & Fraud Detection Hub",
    videos: [
      { id: "sg0kQYvTlnc", title: "Phishing & Scam Awareness", desc: "Learn to identify phishing emails and messages" },
      { id: "XBkzBrXlle0", title: "Online Scam Detection", desc: "How to spot and avoid online scams" },
      { id: "QzLvq6FqCVY", title: "Scam Prevention Techniques", desc: "Stay safe from financial fraud" },
      { id: "R12_y2BhKbE", title: "Cyber Safety Basics", desc: "Protect yourself online" },
      { id: "oLqXDszWIMg", title: "OTP / Mobile / UPI Safety", desc: "Never share your OTP with anyone" },
      { id: "v9_chkR-7AI", title: "UPI Payment Safety", desc: "Secure your digital payments" },
      { id: "AaVO31VoViQ", title: "Banking & Identity Theft", desc: "Protect your banking identity" },
      { id: "QHlTi9CacTc", title: "Identity Theft Prevention", desc: "Keep your financial identity safe" },
      { id: "BF-eamJ-g3g", title: "General Cyber Crime Awareness", desc: "Stay alert against cyber crimes" },
      { id: "eowauGt1Z_g", title: "Cyber Crime Prevention", desc: "How to prevent and report cyber crimes" }
    ],
    questionBank: [
      { q: "What should you do if you receive a suspicious UPI link?", a: ["Click to check", "Delete and report", "Share with friends"], correct: 1 },
      { q: "Is it safe to share your bank OTP with a customer care caller?", a: ["Yes, if they verify details", "No, never share OTP", "Only if the call is recorded"], correct: 1 },
      { q: "Which of these is a common phishing sign?", a: ["Generic greeting like 'Dear User'", "Correct spelling and grammar", "Expected sender address"], correct: 0 },
      { q: "How can you verify a secure website?", a: ["Check for https:// and padlock icon", "If the design looks good", "If someone sent it to you"], correct: 0 },
      { q: "What is a 'Vishing' attack?", a: ["Voice phishing over phone calls", "A computer virus", "A secure network protocol"], correct: 0 },
      { q: "If a caller says your bank account will be blocked immediately unless you verify, you should:", a: ["Panic and give details", "Hang up and call your bank's official number", "Ask them to hold the block"], correct: 1 },
      { q: "True or False: Banks will often ask for your PIN over email.", a: ["True", "False"], correct: 1 },
      { q: "What does Two-Factor Authentication (2FA) do?", a: ["Makes your password twice as long", "Adds a second layer of security like an SMS code", "Allows two users on one account"], correct: 1 }
    ]
  },
  essential: {
    title: "Essential Credit & Debt Management Hub",
    videos: [
      { id: "sKwYf0Wtkzg", title: "RBI – Credit & Loan Basics", desc: "Reserve Bank of India financial education" },
      { id: "Ie9UzlJ5UlY", title: "RBI – Responsible Borrowing", desc: "Borrow responsibly, avoid debt traps" },
      { id: "Lhsd3BBuneE", title: "What is Credit Score (CIBIL)", desc: "Understanding your CIBIL credit score" },
      { id: "CUcSsM_yBLQ", title: "EMI & Loan Awareness", desc: "How EMI impacts your finances" },
      { id: "mgC_BUXZ1bE", title: "Good Debt vs Bad Debt", desc: "Know the difference between good and bad debt" }
    ],
    questionBank: [
      { q: "What is a good credit score range in India?", a: ["300-500", "750-900", "100-200"], correct: 1 },
      { q: "How does missing a credit card payment affect your score?", a: ["It improves it", "No effect", "Decreases it significantly"], correct: 2 },
      { q: "What is a 'Debt-to-Income' ratio?", a: ["Your total debt vs monthly income", "Your age vs income", "Total savings vs total debt"], correct: 0 },
      { q: "Why is paying only the 'minimum due' bad?", a: ["It cancels your card", "High interest compounds on the remaining balance", "It lowers your credit limit immediately"], correct: 1 },
      { q: "What is an emergency fund typically used for?", a: ["Vacations", "Unexpected financial crises", "Buying stocks"], correct: 1 },
      { q: "Which type of debt usually has the highest interest rate?", a: ["Home Loan", "Education Loan", "Credit Card Debt"], correct: 2 },
      { q: "True or False: Closing old credit cards always improves your score.", a: ["True", "False"], correct: 1 },
      { q: "What percentage of credit utilization is considered healthy?", a: ["Under 30%", "Above 80%", "0%"], correct: 0 }
    ]
  },
  growth: {
    title: "Growth, Budgeting & Investment Hub",
    videos: [
      { id: "HQzoZfc3GwQ", title: "50/30/20 Budgeting Rule", desc: "The golden rule of personal budgeting" },
      { id: "TlL4rfhVoMo", title: "Defeating Inflation", desc: "Why saving cash alone isn't enough" },
      { id: "wf91rEGw88Q", title: "Power of Compounding", desc: "The eighth wonder of the world" },
      { id: "0PB3nrig3Mw", title: "Emergency Funds 101", desc: "Building your financial safety net" },
      { id: "iRGRaVoej5M", title: "NCFE Money Management", desc: "Financial literacy for Indian youth" }
    ],
    questionBank: [
      { q: "What does the '50' represent in the 50/30/20 rule?", a: ["Wants", "Needs", "Savings"], correct: 1 },
      { q: "Inflation makes your future money...", a: ["More valuable", "Less valuable", "Stay the same"], correct: 1 },
      { q: "When is the best time to start investing?", a: ["After retirement", "As early as possible", "When I have millions"], correct: 1 },
      { q: "Compound interest is calculated on:", a: ["Only the principal", "Principal plus accumulated interest", "Neither"], correct: 1 },
      { q: "What is the primary enemy of purchasing power over time?", a: ["Taxes", "Inflation", "Fees"], correct: 1 },
      { q: "A 'Want' in your budget refers to:", a: ["Rent", "Dining out", "Health insurance"], correct: 1 },
      { q: "How many months of expenses should an emergency fund cover?", a: ["1 month", "3-6 months", "12-24 months"], correct: 1 },
      { q: "The 'Rule of 72' is used to estimate:", a: ["How much tax you pay", "How long it takes to double your money", "Your retirement age"], correct: 1 }
    ]
  },
  advance: {
    title: "Advance Stock Market & Tax Hub",
    videos: [
      { id: "Xn7KWR9EOGQ", title: "SEBI – Stock Market Basics", desc: "Introduction to Indian equities" },
      { id: "WEDIj9JBTC8", title: "Mutual Funds Sahi Hai", desc: "AMFI official campaign on mutual funds" },
      { id: "p7HKvqRI_Bo", title: "Tax Saving Instruments", desc: "Understanding Sec 80C deductions" },
      { id: "0Bmhjf0rEJY", title: "SIP Strategy", desc: "Systematic Investment Planning explained" },
      { id: "8HoXTjVPYgM", title: "Long Term Wealth Creation", desc: "Basics of building wealth over time" }
    ],
    questionBank: [
      { q: "What is an 'IPO'?", a: ["Investment Portfolio Option", "Initial Public Offering", "Internal Profit Output"], correct: 1 },
      { q: "A 'Mutual Fund' is a pool of managed money. True or False?", a: ["True", "False"], correct: 0 },
      { q: "Which of these is a tax-saving instrument under Sec 80C?", a: ["Fixed Deposit", "ELSS Mutual Fund", "Both of these"], correct: 2 },
      { q: "What does SIP stand for?", a: ["Systematic Investment Plan", "Secure Increment Portfolio", "Saving In Portions"], correct: 0 },
      { q: "What kind of risk is primarily associated with equities?", a: ["Market Risk", "No Risk", "Guaranteed returns"], correct: 0 },
      { q: "What is diversification?", a: ["Putting all money in one stock", "Spreading investments to reduce risk", "Selling everything during a crash"], correct: 1 },
      { q: "Which authority regulates the stock market in India?", a: ["RBI", "SEBI", "IRDAI"], correct: 1 },
      { q: "Long Term Capital Gains (LTCG) tax on equity applies after holding for:", a: ["1 year", "3 months", "5 years"], correct: 0 }
    ]
  }
};

export default function LearningHub() {
  const { hubId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState('video');
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const user = getStoredUser();

  const hub = HUB_CONTENT[hubId] || HUB_CONTENT.security;

  // DYNAMIC RANDOMIZER LOGIC with LocalStorage Persistence
  useEffect(() => {
    // Check if there are saved questions for this specific user/hub combination to survive network refreshes
    const storageKey = `finplay_quiz_${user?.id || 'guest'}_${hubId}`;
    const savedQuizState = localStorage.getItem(storageKey);
    
    if (savedQuizState) {
       // Restore the exact 5 questions from before the network drop/refresh
       setCurrentQuestions(JSON.parse(savedQuizState));
    } else {
       // Generate 5 random unique questions from the bank
       const bank = hub.questionBank;
       const shuffled = [...bank].sort(() => 0.5 - Math.random());
       const selected = shuffled.slice(0, 5);
       setCurrentQuestions(selected);
       localStorage.setItem(storageKey, JSON.stringify(selected));
    }
    
    // Reset answers when changing hub
    setAnswers({});
    setStep('video');
  }, [hubId, hub.questionBank, user?.id]);

  const handleQuizSubmit = () => {
    const storageKey = `finplay_quiz_${user?.id || 'guest'}_${hubId}`;
    let correctCount = 0;
    currentQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correct) correctCount++;
    });
    
    const percentage = (correctCount / currentQuestions.length) * 100;
    setScore(percentage);
    setStep('certificate');
    
    if (percentage >= 70) {
        // Course Completed Successfully! 
        // 1. Remove the saved state so the NEXT time they visit, they get NEW random questions.
        localStorage.removeItem(storageKey);
        
        // 2. Sync progress with backend AI
        if (user && getAuthToken()) {
            fetch(apiUrl('/api/activity'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({
                    gameType: `Certification: ${hub.title}`,
                    score: percentage,
                    progress: "Completed"
                })
            }).catch(e => console.log('Silently falling back if offline'));
        }
    }
  };

  if (step === 'certificate') {
    return (
      <div className="hub-container">
        {score >= 70 ? (
          <div className="certificate-view">
            <div className="cert-frame">
              <div className="cert-header">
                <h2>📜 CERTIFICATE OF COMPLETION</h2>
                <p>This is to certify that</p>
                <h1 className="user-name">{user?.name || "Diligent Learner"}</h1>
                <p>has successfully completed the</p>
                <h3>{hub.title}</h3>
                <p>with a score of <strong>{score.toFixed(0)}%</strong></p>
                <div className="cert-footer">
                  <span>Authorized by <strong>FinPlay Bharat</strong></span>
                  <span>Date: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* MONETIZATION: AFFILIATE CTAs */}
            <div className="affiliate-section">
              <div className="affiliate-card">
                <div className="af-icon">🚀</div>
                <div className="af-content">
                  <h3>Ready for the Real World?</h3>
                  <p>
                    {hubId === 'security' 
                      ? "Mastered fraud detection? Now secure your actual profile. Check your CIBIL score for free!" 
                      : "Put your knowledge into action! Open a free Demat account with Upstox/Zerodha and start investing."
                    }
                  </p>
                  <div className="af-actions">
                    <a href={hubId === 'security' ? "https://www.cibil.com/freecibilscore" : "https://upstox.com/open-demat-account/?f=FinPlayBharat"} target="_blank" rel="noreferrer" className="affiliate-btn">
                      {hubId === 'security' ? "🛡️ Check CIBIL Score" : "📈 Open Trading Account"}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="cert-actions">
              <button onClick={() => window.print()} className="print-btn">🖨️ Print Certificate</button>
              <button onClick={() => navigate('/')} className="home-btn">Finish</button>
            </div>
          </div>
        ) : (
          <div className="fail-view">
            <h2>Oops! You scored {score.toFixed(0)}%</h2>
            <p>You need at least 70% to earn a certificate. Watch the videos closely and try again!</p>
            <button onClick={() => {
              setAnswers({}); 
              setStep('video'); 
            }} className="retry-btn">Retry Hub</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="hub-container">
      <div className="hub-header">
        <h1>{hub.title}</h1>
        <div className="hub-progress">
          <div className={`step-indicator ${step === 'video' ? 'active' : 'done'}`}>1. Video Lectures</div>
          <div className={`step-indicator ${step === 'quiz' ? 'active' : ''}`}>2. Certification Test</div>
          <div className={`step-indicator ${step === 'certificate' ? 'active' : ''}`}>3. Verify & Print</div>
        </div>
      </div>

      {step === 'video' ? (
        <div className="content-view">
          
          <div className="videos-grid">
             {hub.videos.map((vid, idx) => (
                <div key={idx} className="video-card">
                  <div className="video-wrapper">
                    <iframe 
                        src={`https://www.youtube.com/embed/${vid.id}?modestbranding=1&rel=0`} 
                        title={vid.title} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                  </div>
                  <div className="video-meta">
                    <h4>{vid.title}</h4>
                    <p>{vid.desc}</p>
                  </div>
                </div>
             ))}
          </div>

          <div className="video-info full-width-action">
             <h3>Ready to test your knowledge?</h3>
             <p>After watching the assigned lectures, you can take your dynamically generated 5-question test. You must score 70% to pass.</p>
             <button onClick={() => setStep('quiz')} className="start-quiz-btn">Take 5-Question Certification</button>
          </div>
        </div>
      ) : (
        <div className="quiz-view">
          {currentQuestions.map((q, idx) => (
            <div key={idx} className="quiz-card">
              <h4>Question {idx + 1} of 5</h4>
              <p className="quiz-q">{q.q}</p>
              <div className="opt-grid">
                {q.a.map((opt, oIdx) => (
                  <button 
                    key={oIdx} 
                    className={`opt-btn ${answers[idx] === oIdx ? 'selected' : ''}`}
                    onClick={() => setAnswers({...answers, [idx]: oIdx})}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button 
            className="submit-quiz-btn" 
            disabled={Object.keys(answers).length < currentQuestions.length}
            onClick={handleQuizSubmit}
          >
            Submit for Certification
          </button>
        </div>
      )}
    </div>
  );
}
