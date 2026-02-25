import Logo from "./Logo"
import "./Navbar.css"

export default function Navbar() {
    return (
        <div className="navbar">    

            <Logo />

            <div className="nav-center">
                <a href="#">Home</a>
                <a href="#">Features</a>
                <a href="#">Demo</a>
                <a href="#">How it Works</a>
                <a href="#">Company</a>
            </div>

            <div className="nav-right">
                <button>Login</button>
                <button>Toggle</button>
            </div>
            
            
        </div>
    )
}