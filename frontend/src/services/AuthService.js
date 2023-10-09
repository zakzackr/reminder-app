import axios from "axios";

const AUTH_REST_API_BASE_URL = "http://localhost:8080/api/auth"

export const registerAPICall = (registerObj) => axios.post(AUTH_REST_API_BASE_URL + "/register", registerObj)

export const LoginAPICall = (usernameOrEmail, password) => axios.post(AUTH_REST_API_BASE_URL + "/login", {usernameOrEmail, password})

export const storeToken = (token) => localStorage.setItem("token", token)

export const getToken = () => localStorage.getItem("token")

export const getUserId = () => sessionStorage.getItem("userId")

// export const saveLoggedInUser = (username, role) => {
//     sessionStorage.setItem("authenticatedUser", username)
//     sessionStorage.setItem("role", role)
// }

export const saveLoggedInUser = (username, role, userId) => {
    sessionStorage.setItem("authenticatedUser", username)
    sessionStorage.setItem("role", role)
    sessionStorage.setItem("userId", userId)
}

export const getLoggedInUsername = () => {
    const username = sessionStorage.getItem("authenticatedUser")
    return username
}

export const isUserLoggedIn = () => {
    const username = getLoggedInUsername()

    return username != null
}

export const logout = () => {
    localStorage.clear()
    sessionStorage.clear()
}

export const isAdminUser = () => {
    let role = sessionStorage.getItem("role")

    return role != null && role == 'ROLE_ADMIN';
}