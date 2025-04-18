import axios from "axios";

import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMe, refreshToken } from "../services/AuthService";

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

  const logout = async () => {
    try {
      await logoutAPICall(); 
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      setAccessToken(null);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!accessToken) { // page reloadによりアクセストークンがメモリ上にない場合
        refreshToken()
            .then(response => {
                // 新しいアクセストークンをメモリ上に保存
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
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            console.log('loop');
            const response = await refreshToken();
            setAccessToken(response.data.accessToken);
            originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
            return axios(originalRequest);
          } catch {
            // TODO: logout()を使って、logoutしてaccess-tokenをnull, refresh-tokenをinvalidにする
            console.log("logout");
            logout();
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  // useEffect(() => {
  //   fetchMe()
  //     .then((token) => {
  //       setAccessToken(token); // アクセストークンを保存
  //       setIsAuth(true);
  //     })
  //     .catch((error) => {
  //       if (error.response?.status === 401) {
  //         refreshToken()
  //           .then((newToken) => {
  //             setAccessToken(newToken); // 新しいアクセストークンを保存
  //             setIsAuth(true);
  //           })
  //           .catch(() => setIsAuth(false)); // 必要に応じてログイン画面に戻る処理を追加
  //       } else {
  //         setIsAuth(false); // 必要に応じてログイン画面に戻る処理を追加
  //       }
  //     });
  // }, []);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, accessToken, setAccessToken }}>
      {children}
      </AuthContext.Provider>
  );
};
