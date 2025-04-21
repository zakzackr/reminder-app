import './App.css'

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
    const { accessToken } = useContext(AuthContext);

    if (accessToken == null) return null;
    if (accessToken) return children;
    return < Navigate to='/' />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <HeaderComponent />
        <Routes>
          <Route path='/' element = { <LoginComponent /> }></Route>
          <Route path='/reminders/new' element = { 
            <AuthenticatedRoute>
              <ReminderComponent /> 
            </AuthenticatedRoute>
          }></Route>
          <Route path='/reminders/:id/edit' element = { 
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
        {/* <FooterComponent /> */}
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
