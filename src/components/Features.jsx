import { useNavigate } from "react-router-dom"
import "./Features.css"

export default function Features() {

  const navigate = useNavigate()

  const features = [
    {
      title: "Budget Simulator",
      desc: "Manage virtual ₹20,000 salary with real-life expenses.",
      tag: "Most Popular",
      icon: "₹",
      link: "/demo"
    },
    {
      title: "Fraud Detection Game",
      desc: "Identify phishing, UPI frauds, and scams in simulation.",
      tag: "Security",
      icon: "🛡️",
      link: "/hub/security"
    },
    {
      title: "Credit Score Challenge",
      desc: "Build virtual credit history through decisions.",
      tag: "Essential",
      icon: "📊",
      link: "/hub/essential"
    },
    {
      title: "Investment Basics",
      desc: "Virtual stock market & mutual fund simulations.",
      tag: "Advanced",
      icon: "💰",
      link: "/hub/advance"
    },
    {
      title: "Budgeting Masterclass",
      desc: "Learn the 50/30/20 rule and start saving.",
      tag: "Growth",
      icon: "📈",
      link: "/hub/growth"
    },
    {
      title: "Adaptive Learning",
      desc: "Difficulty adjusts based on your performance.",
      tag: "AI-Powered",
      icon: "🤖",
      link: "/hub/adaptive"
    }
  ]

  return (
    <section className="features" id="features">

      <h2>Interactive Learning Modules</h2>
      <p className="subtitle">
        Learn through simulation, not memorization
      </p>

      <div className="features-grid">
        {features.map((item, index) => (
          <div key={index} className="feature-card" onClick={() => item.link && navigate(item.link)} style={{ cursor: item.link ? 'pointer' : 'default' }}>
            <div className="icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <span className="tag">{item.tag}</span>
          </div>
        ))}
      </div>

    </section>
  )
}