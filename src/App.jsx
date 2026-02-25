import Navbar from "./components/Navbar";
import Home from "./components/Home";
import "./App.css"
import "./styles/theme.css"

export default function App() {
  return (
    <div className="app-content">
      <Navbar />
      <Home />
    </div>
  )
}