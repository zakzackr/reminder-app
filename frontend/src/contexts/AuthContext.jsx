import React, { createContext, useState, useEffect } from "react";
import { checkLoginStatusAPICall } from "../services/AuthService";

export const AuthContext = createContext({
  isAuth: false,
  setIsAuth: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    checkLoginStatusAPICall()
      .then(() => {
        setIsAuth(true)
    })
      .catch(() => setIsAuth(false));
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
