import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // TODO: 本番環境では<React.StrictMode>を使用
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
