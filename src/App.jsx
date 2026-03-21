import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Demo from "./components/Demo";
import Login from "./components/Login";
import Contact from "./components/Contact";
import Legal from "./components/Legal";
import About from "./components/About";
import AdaptiveLearning from "./components/AdaptiveLearning";
import LearningHub from "./components/LearningHub";
import AdminPanel from "./components/AdminPanel";
import Updates from "./components/Updates";
import Leaderboard from "./components/Leaderboard";
import Footer from "./components/Footer"
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
        <Route path="/login" element={<Login />} />
        <Route path="/hub/:hubId" element={<LearningHub />} />
        <Route path="/about" element={<About />} />
        <Route path="/hub/adaptive" element={<AdaptiveLearning />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Legal />} />
        <Route path="/terms" element={<Legal />} />
        <Route path="/gdpr" element={<Legal />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
      <Footer />
    </div>
  )
}