import "./Home.css"
import Hero from "./Hero"
import Features from "./Features"

export default function Home() {
  return (
    <div id="home">
      
        <div className="hometext">
            <Hero />
            <Features />
        </div>

    </div>
  )
}