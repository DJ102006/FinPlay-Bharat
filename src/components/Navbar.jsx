import { Link } from "react-router-dom"
import Logo from "./Logo"
import Toggle from "./Toggle"
import "./Navbar.css"

export default function Navbar() {
    return (
        <div className="navbar">    

            <Logo />

            <div className="nav-center">
                <a href="#home">Home</a>
                <a href="#features">Features</a>
                <Link to="/demo">Demo</Link>
                <a href="#">How it Works</a>
                <a href="#">Company</a>
            </div>

            <div className="nav-right">
                <button className="login-btn">Login</button>
                <Toggle />
            </div>
            
            
        </div>
    )
}