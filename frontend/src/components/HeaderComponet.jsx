import { useEffect, useContext } from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { logoutAPICall } from '../services/AuthService'

const HeaderComponent = () => {

    const navigate = useNavigate()
    const { accessToken, setAccessToken } = useContext(AuthContext);

    const logout = async () => {
        try {
          await logoutAPICall(); 
        } catch (error) {
          console.error("Logout API failed", error);
        } finally {
          setAccessToken(null);
          navigate("/login?logout=true");
        }
      };

    return (
        <header>
            <nav className="navbar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 60 }}>
                <div>
                    <a href="/" className="navbar-brand" style={{ paddingLeft: 0 }}>
                        Reminders
                    </a>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    {!accessToken && (
                        <NavLink to="/register" className="nav-link" style={{ marginRight: 8 }}>
                            Register
                        </NavLink>
                    )}
                    {!accessToken && (
                        <NavLink to="/login" className="nav-link" style={{ marginRight: 8 }}>
                            Login
                        </NavLink>
                    )}
                    {accessToken && (
                        <button className="nav-link" style={{ background: "none", border: "none", color: "#222", cursor: "pointer", fontWeight: 500, padding: "8px 12px" }} onClick={logout}>
                            Logout
                        </button>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default HeaderComponent
