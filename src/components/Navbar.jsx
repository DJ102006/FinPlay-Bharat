import { Link , useNavigate} from "react-router-dom"
import Logo from "./Logo"
import Toggle from "./Toggle"
import "./Navbar.css"

export default function Navbar() {
    return (
        <div className="navbar">    

            <Logo />

            <div className="nav-center">
                <Link to="/">Home</Link>
                <Link to="/#features">Features</Link>
                <Link to="/demo">Demo</Link>
                <Link to="/#how">How it Works</Link>
                <span className="dropdown">
                    <span className="nav-link">Company</span>

                    <div className="dropdown-menu">
                        <Link to="/about">About Us</Link>
                        <Link to="/partners">Partners</Link>
                    </div>
                </span>
            </div>

            <div className="nav-right">
                <button className="login-btn">Login</button>
                <Toggle />
            </div>
            
            
        </div>
    )
}