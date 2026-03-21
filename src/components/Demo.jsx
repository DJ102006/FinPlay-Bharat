import { useState } from "react"
import "./Demo.css"

export default function Demo() {
  const initialSalary = 20000
  const [balance, setBalance] = useState(initialSalary)
  const [days, setDays] = useState(0)
  
  const [categories, setCategories] = useState({
    rent: { amount: 0, rec: "6,000-8,000", step: 500, label: "Rent & Utilities", icon: "🏠" },
    food: { amount: 0, rec: "4,000-5,000", step: 300, label: "Food & Groceries", icon: "🍴" },
    entertainment: { amount: 0, rec: "2,000-3,000", step: 200, label: "Entertainment", icon: "🎬" },
    savings: { amount: 0, rec: "Min 20% (₹4,000)", step: 500, label: "Savings & Investment", icon: "📈" }
  })

  const updateCategory = (key, change) => {
    const cost = change
    if (balance - cost < 0 && change > 0) return
    if (categories[key].amount + change < 0) return

    setBalance(prev => prev - cost)
    setCategories(prev => ({
      ...prev,
      [key]: { ...prev[key], amount: prev[key].amount + change }
    }))
  }

  const simulateDay = () => {
    if (days < 30) setDays(days + 1)
  }

  const resetGame = () => {
    setBalance(initialSalary)
    setDays(0)
    setCategories({
      rent: { ...categories.rent, amount: 0 },
      food: { ...categories.food, amount: 0 },
      entertainment: { ...categories.entertainment, amount: 0 },
      savings: { ...categories.savings, amount: 0 }
    })
  }

  const totalSpent = Object.values(categories).reduce((acc, cat) => acc + cat.amount, 0)
  const savingsRate = ((categories.savings.amount / initialSalary) * 100).toFixed(0)

  return (
    <div className="demo-section">
      <div className="demo-header">
        <h1>Interactive Budget Simulation</h1>
        <p>Try our gamified learning experience</p>
      </div>

      <div className="challenge-container">
        {/* Main Header Bar */}
        <div className="challenge-hero">
          <div className="hero-left-info">
            <h2>🎮 Monthly Budget Challenge</h2>
            <p>Manage ₹20,000 salary for 30 days</p>
          </div>
          <div className="hero-stats">
            <div className="stat-box">
              <span>Remaining Balance</span>
              <h3>₹{balance.toLocaleString()}</h3>
            </div>
            <div className="stat-box">
              <span>Days Completed</span>
              <h3>{days}/30</h3>
            </div>
            <div className="stat-box">
              <span>Savings Rate</span>
              <h3>{savingsRate}%</h3>
            </div>
          </div>
        </div>

        <div className="challenge-content">
          {/* Left Column: Categories */}
          <div className="categories-list">
            {Object.entries(categories).map(([key, cat]) => (
              <div key={key} className="budget-card">
                <div className="card-top">
                  <div className="card-title">
                     <span className="card-icon">{cat.icon}</span>
                     <h4>{cat.label}</h4>
                  </div>
                  <div className="card-value">₹{cat.amount.toLocaleString()}</div>
                </div>
                
                <div className="card-controls">
                  <button onClick={() => updateCategory(key, -cat.step)}>-₹{cat.step}</button>
                  <button onClick={() => updateCategory(key, cat.step)}>+₹{cat.step}</button>
                </div>
                <p className="recommendation">Recommended: ₹{cat.rec}</p>
              </div>
            ))}
          </div>

          {/* Right Column: Summary */}
          <div className="health-sidebar">
            <h3>Your Financial Health</h3>
            
            <div className="health-stat">
               <div className="stat-label">
                  <span>Savings Progress</span>
                  <span>{savingsRate}%</span>
               </div>
               <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min(savingsRate, 100)}%` }}></div>
               </div>
            </div>

            <div className="info-tip">
               ℹ️ Allocate your ₹20,000 salary across categories
            </div>

            <div className="achievement-tags">
               <span className="tag inactive">Budget Master</span>
               <span className="tag inactive">Savings Star</span>
               <span className="tag inactive">Wise Spender</span>
            </div>

            <div className="action-buttons">
               <button 
                 className={`simulate-btn ${balance > 0 ? "locked" : ""}`} 
                 onClick={simulateDay}
                 disabled={balance > 0}
               >
                 {balance > 0 ? `▶▶ Allocate ₹${balance.toLocaleString()} first` : "▶▶ Simulate Next Day"}
               </button>
               <button className="reset-inline" onClick={resetGame}>🔄 Reset Game</button>
            </div>
          </div>
        </div>

        <div className="pro-tip-footer">
          💡 <strong>Pro Tip:</strong> Aim to save at least 20% of your income. Emergency fund should cover 3-6 months of expenses.
        </div>
      </div>
    </div>
  )
}