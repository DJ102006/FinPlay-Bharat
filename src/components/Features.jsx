import "./Features.css"

export default function Features() {

  const features = [
    {
      title: "Budget Simulator",
      desc: "Manage virtual ₹20,000 salary with real-life expenses.",
      tag: "Most Popular",
      icon: "₹"
    },
    {
      title: "Fraud Detection Game",
      desc: "Identify phishing, UPI frauds, and scams in simulation.",
      tag: "Security",
      icon: "🛡️"
    },
    {
      title: "Credit Score Challenge",
      desc: "Build virtual credit history through decisions.",
      tag: "Essential",
      icon: "📊"
    },
    {
      title: "Investment Basics",
      desc: "Virtual stock market & mutual fund simulations.",
      tag: "Advanced",
      icon: "💰"
    },
    {
      title: "Adaptive Learning",
      desc: "Difficulty adjusts based on your performance.",
      tag: "AI-Powered",
      icon: "🤖"
    },
    {
      title: "Multi-language Support",
      desc: "Available in Hindi, Gujarati, Marathi & more.",
      tag: "For Bharat",
      icon: "🌍"
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
          <div key={index} className="feature-card">
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