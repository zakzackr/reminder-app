import axios from "axios";

import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutAPICall, refreshToken } from "../services/AuthService";

export const AuthContext = createContext({
  isAuth: false,
  setIsAuth: () => {},
  accessToken: null,
  setAccessToken: () => {}
});

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) { // page reloadによりアクセストークンがメモリ上にない場合
        refreshToken()
            .then(response => {
                // 新しいアクセストークンをメモリ上に保存
                console.log("New accessToken set:", response.data.accessToken);
                setAccessToken(response.data.accessToken);
            })
            .catch(() => {
              setAccessToken(null);
              console.log('refreshToken() returns an error');
            });  // TODO: 必要に応じてlogin画面に遷移
    }
  }, []);
    
  // requestをinterceptして、authrization headerにaccess-tokenをset
  useEffect(() => {
    const authInterceptor = axios.interceptors.request.use(
      (config) => {
        if (accessToken) {
          console.log('Setting Authorization header:', `Bearer ${accessToken}`);
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(authInterceptor);
    };
  }, [accessToken]);

  // responseをinterceptする。401 ERRORの時にrefreshToken()を呼び出し、new access-tokenを取得する。
  useEffect(() => {
    const refreshInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        // TODO: server側でinvalid refresh-tokenのresponse.status.codeを考える。401 or 403??
        if (error.response.status === 401 && !originalRequest._retry 
          && !originalRequest.url.includes("/refresh-token") && !originalRequest.url.includes("/logout")
        ) {
          originalRequest._retry = true;
          try {
            const response = await refreshToken();
            setAccessToken(response.data.accessToken);
            originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
            return axios(originalRequest);
          } catch {
            // TODO: logout()を使って、logoutしてaccess-tokenをnull, refresh-tokenをinvalidにする
            // logout();
            setAccessToken(null);
            navigate("/login");
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, accessToken, setAccessToken }}>
      {children}
      </AuthContext.Provider>
  );
};
