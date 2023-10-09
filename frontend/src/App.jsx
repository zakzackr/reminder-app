import './App.css'
import ListReminderComponent from './components/ListReminderComponent'
import HeaderComponent from './components/HeaderComponet'
import FooterComponent from './components/FooterComponent'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ReminderComponent from './components/ReminderComponent'
import RegisterComponent from './components/RegisterComponent'
import LoginComponent from './components/LoginComponent'
import { isUserLoggedIn } from './services/AuthService'


function App() {

  function AuthenticatedRoute({children}){
    const isAuth = isUserLoggedIn()

    if (isAuth) return children
    return < Navigate to='/' />
  }

  return (
    <BrowserRouter>
      <HeaderComponent />
      <Routes>
        <Route path='/' element = { <LoginComponent /> }></Route>
        <Route path='/add-reminder/:userId' element = { 
          <AuthenticatedRoute>
            <ReminderComponent /> 
          </AuthenticatedRoute>
        }></Route>
        <Route path='/update-reminder/:userId/:id' element = { 
          <AuthenticatedRoute>
            <ReminderComponent /> 
          </AuthenticatedRoute>
        }></Route>
        <Route path='/reminder/:userId' element = { 
          <AuthenticatedRoute>
            <ListReminderComponent /> 
          </AuthenticatedRoute>
        }></Route>
        <Route path='/register' element = { <RegisterComponent /> }></Route>
        <Route path='/login' element = { <LoginComponent /> }></Route>
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  )
}

export default App