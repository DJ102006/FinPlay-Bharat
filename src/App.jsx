import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Demo from "./components/Demo";
import ScrollToTop from "./components/ScrollToTop"
import "./App.css"
import "./styles/theme.css"

export default function App() {
  return (
    <div className="app-content">
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<Demo />} />
      </Routes>
    </div>
  )
}