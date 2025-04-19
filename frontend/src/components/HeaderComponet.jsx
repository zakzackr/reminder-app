import { useEffect, useContext } from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { logoutAPICall } from '../services/AuthService'

const HeaderComponent = () => {

    // const nav = useNavigate()
    const { accessToken } = useContext(AuthContext);

    // function handleLogout(){
    //     setIsAuth(false)
    //     nav('/login')
    // }

    return (
        <div> 
            <header>
                <nav className='navbar navbar-expand-md navbar-dark bg-dark'>
                    <div>
                        <a href='/' className='navbar-brand' style={{ paddingLeft: '10px' }}>
                            Reminders
                        </a>
                    </div>
                    <div className='collapse navbar-collapse'>
                        <ul className='navbar-nav'>
                            {
                                accessToken && 
                                <li className='nav-item'>
                                    <NavLink to={`/reminders`}  className="nav-link">My Lists</NavLink>
                                </li>
                            }
                        </ul>
                    </div>
                    <ul className='navbar-nav'>
                        {
                            !accessToken && 
                            <li className='nav-item'>
                                <NavLink to="/register" className="nav-link">Register</NavLink>
                            </li>
                        }
                        {
                            !accessToken && 
                            <li className='nav-item'>
                                <NavLink to="/login" className="nav-link">Login</NavLink>
                            </li>
                        }
                        {
                            accessToken && 
                            <li className='nav-item'>
                                <button className="nav-link" onClick={logoutAPICall}>Logout</button>
                            </li>
                        }
                    </ul>
                </nav>
            </header>
        </div>
    )
}

export default HeaderComponent
