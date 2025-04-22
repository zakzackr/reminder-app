import axios from "axios";

import { useContext } from 'react'
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"


const AUTH_BASE_URL = `${import.meta.env.VITE_BASE_URL}/api/auth`;

export const registerAPICall = (registerObj) => axios.post(AUTH_BASE_URL + "/register", registerObj, {withCredentials: false})

export const loginAPICall = (usernameOrEmail, password) => {
  console.log("loginAPICall()");
  return axios.post(AUTH_BASE_URL + "/login", {usernameOrEmail, password}, {withCredentials: true});
} 


export const fetchMe = () => axios.get(AUTH_BASE_URL + "/me");

// get new access-token using refresh-token
export const refreshToken = () => {
    console.log("refreshTokenAPICall()");
    return axios.post(AUTH_BASE_URL + "/refresh-token", null, { withCredentials: true })
};

// TODO: logoutの処理を確認
export const logoutAPICall = () => axios.post(AUTH_BASE_URL + "/logout", null, {withCredentials: true});


// export const retryRequestWithRefreshToken = async (originalRequest) => {
//   try {
//       const newAccessToken = await refreshToken();
//       originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//       return axios(originalRequest); // 元のリクエストを再試行
//   } catch (error) {
//       console.error("リクエストの再試行に失敗しました", error); 
//       // TODO: この場合、ログイン画面に移動？その際、古いrefresh-token削除すべき？
//       throw error;
//   }
// };

// export const refreshToken = () => {
//     return axios.post(AUTH_BASE_URL + "/refresh-token")
//         .then(() => {
//             console.log("new access token issued");
//         })
//         .catch(error => {
//             console.error("Token refresh failed", error);
//             logout()
//         });
// }

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
