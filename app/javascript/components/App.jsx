import React, { useEffect } from 'react'
import Desktop from './Desktop'
import Login from './Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './Header'
import Cookies from 'js-cookie'
import api from '../helpers/api'

const App = () => {
  useEffect(() => {
    const token = Cookies.get('kangaroo_session_token')
    if (token) {
      api.post('/authorized', { token: token }).then((res) => {
        if (!res.data.authorized) {
          window.location.href = '/users/sign_in'
          return null
        } 
        else {
          return null
        }
      })
    }
  }, [])
  return (
    <Header>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/desktop" element={<Desktop />} />
        </Routes>
      </Router>
    </Header>
  )
}

export default App
