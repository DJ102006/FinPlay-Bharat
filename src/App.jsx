import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Demo from "./components/Demo";
import Login from "./components/Login";
import Contact from "./components/Contact";
import Legal from "./components/Legal";
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
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Legal />} />
        <Route path="/terms" element={<Legal />} />
        <Route path="/gdpr" element={<Legal />} />
      </Routes>
      <Footer />
    </div>
  )
}