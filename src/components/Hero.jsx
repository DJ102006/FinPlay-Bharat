import { useNavigate } from "react-router-dom"
import "./Hero.css"
import dashboardImg from "../assets/dashboard.png"
import card1 from "../assets/card1.png"
import card2 from "../assets/card2.png"
import card3 from "../assets/card3.png"

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="hero">

      {/* LEFT SIDE */}
      <div className="hero-left">
        <h1>
          Learn Money by Playing.
          <span className="highlight"> Not by Losing.</span>
        </h1>

        <p>
          India's first gamified financial literacy platform that transforms
          complex finance concepts into engaging games.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn" onClick={() => navigate("/login")}>Start Learning Free</button>
          <button className="secondary-btn" onClick={() => navigate("/demo")}>Watch Demo</button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hero-right">

        <div className="dashboard-card">
          <img src={dashboardImg} alt="Dashboard" />
        </div>

        <div className="floating-card card-one">
          <img src={card1} alt="" />
        </div>

        <div className="floating-card card-two">
          <img src={card2} alt="" />
        </div>

        <div className="floating-card card-three">
          <img src={card3} alt="" />
        </div>

      </div>

    </section>
  )
}