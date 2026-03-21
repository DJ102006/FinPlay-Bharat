import { Link , useNavigate} from "react-router-dom"
import { useEffect, useState } from "react"
import Logo from "./Logo"
import Toggle from "./Toggle"
import "./Navbar.css"
import { clearAuthSession, getStoredUser, subscribeToAuthChanges } from "../lib/auth"

export default function Navbar() {
    const navigate = useNavigate()
    const [user, setUser] = useState(() => getStoredUser())

    const handleNavClick = (e, path, hash) => {
        if (window.location.pathname === path) {
            e.preventDefault();
            const element = document.getElementById(hash.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
                // Also update the URL without refreshing
                window.history.pushState(null, '', path + hash);
            }
        }
    };

    useEffect(() => subscribeToAuthChanges(() => setUser(getStoredUser())), []);

    const handleAccountClick = () => {
        if (user?.isAdmin) {
            navigate("/admin")
            return
        }

        navigate("/login")
    }

    const handleLogout = () => {
        clearAuthSession()
        navigate("/")
    }

    return (
        <div className="navbar">    

            <Logo />

            <div className="nav-center">
                <Link to="/">Home</Link>
                <Link to="/#features" onClick={(e) => handleNavClick(e, '/', '#features')}>Features</Link>
                <Link to="/demo">Demo</Link>
                <Link to="/updates">Updates</Link>
                <Link to="/leaderboard">Leaderboard</Link>
                {user?.isAdmin && <Link to="/admin" style={{color: '#f59e0b', fontWeight: 'bold'}}>⚙️ Dashboard</Link>}
                <Toggle />
            </div>

            <div className="nav-right">
                <button className="login-btn" onClick={handleAccountClick}>
                    {user ? (user.isAdmin ? "Dashboard" : (user.name?.split(" ")[0] || "Account")) : "Login"}
                </button>
                {user && <button className="login-btn" onClick={handleLogout}>Logout</button>}
            </div>
            
            
        </div>
    )
}
