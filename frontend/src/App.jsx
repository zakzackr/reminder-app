import './App.css'

import axios from 'axios'
axios.defaults.withCredentials = true; 

import { useContext } from "react";
import ListReminderComponent from './components/ListReminderComponent'
import HeaderComponent from './components/HeaderComponet'
import FooterComponent from './components/FooterComponent'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ReminderComponent from './components/ReminderComponent'
import RegisterComponent from './components/RegisterComponent'
import LoginComponent from './components/LoginComponent'
import { AuthContext, AuthProvider } from './contexts/AuthContext'

function App() {

  function AuthenticatedRoute({children}){
    const { isAuth } = useContext(AuthContext);

    if (isAuth == null) return null;
    if (isAuth) return children;
    return < Navigate to='/' />;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <HeaderComponent />
        <Routes>
          <Route path='/' element = { <LoginComponent /> }></Route>
          <Route path='/add-reminder' element = { 
            <AuthenticatedRoute>
              <ReminderComponent /> 
            </AuthenticatedRoute>
          }></Route>
          <Route path='/update-reminder/:id' element = { 
            <AuthenticatedRoute>
              <ReminderComponent /> 
            </AuthenticatedRoute>
          }></Route>
          <Route path='/reminders' element = { 
            <AuthenticatedRoute>
              <ListReminderComponent /> 
            </AuthenticatedRoute>
          }></Route>
          <Route path='/register' element = { <RegisterComponent /> }></Route>
          <Route path='/login' element = { <LoginComponent /> }></Route>
        </Routes>
        <FooterComponent />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
