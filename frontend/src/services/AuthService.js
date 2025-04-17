import axios from "axios";

import { useContext } from 'react'
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"


const AUTH_BASE_URL = "http://localhost:8080"

export const registerAPICall = (registerObj) => axios.post(AUTH_BASE_URL + "/register", registerObj, {withCredentials: false})

export const loginAPICall = (usernameOrEmail, password) => 
    axios.post(AUTH_BASE_URL + "/login", {usernameOrEmail, password});

export const checkLoginStatusAPICall = () => axios.get(AUTH_BASE_URL + "/me");

export const refreshToken = () => {
    return axios.post(AUTH_BASE_URL + "/refresh-token")
        .then(() => {
            console.log("new access token issued");
        })
        .catch(error => {
            console.error("Token refresh failed", error);
            logout()
        });
}

export const logout = () => {
    const navigate = useNavigate();
    const { setIsAuth } = useContext(AuthContext);

    setIsAuth(false);
    navigate('/login');
}

// export const storeToken = (token) => localStorage.setItem("token", token)

// export const getToken = () => localStorage.getItem("token")

// export const getUserId = () => sessionStorage.getItem("userId")

// export const saveLoggedInUser = (username, role) => {
//     sessionStorage.setItem("authenticatedUser", username)
//     sessionStorage.setItem("role", role)
// }

// export const saveLoggedInUser = (username, role, userId) => {
//     sessionStorage.setItem("authenticatedUser", username)
//     sessionStorage.setItem("role", role)
//     sessionStorage.setItem("userId", userId)
// }

// export const getLoggedInUsername = () => {
//     const username = sessionStorage.getItem("authenticatedUser")
//     return username
// }

// export const isUserLoggedIn = () => {
//     const username = getLoggedInUsername()

//     return username != null
// }

// export const logout = () => {
//     localStorage.clear()
//     sessionStorage.clear()
// }

// export const isAdminUser = () => {
//     let role = sessionStorage.getItem("role")

//     return role != null && role == 'ROLE_ADMIN';
// }
