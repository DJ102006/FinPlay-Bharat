import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import "./Home.css"
import Hero from "./Hero"
import Features from "./Features"
import HowItWorks from "./HowItWorks"

export default function Home() {

  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const section = document.querySelector(location.hash)
      if (section) {
        section.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [location])

  return (
    <div id="home">
      
        <div className="hometext">
            <Hero />
            <Features />
            <HowItWorks />
        </div>

    </div>
  )
}