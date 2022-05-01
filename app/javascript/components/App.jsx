import React, { useEffect } from 'react'
import Desktop from './Desktop'
import Login from './Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './Header'
import api from '../helpers/api'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '../reducers/user/userSlice'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!sessionStorage.getItem('user')) {
      api.post('/authorized').then((res) => {
        if (res.data.user) {
          sessionStorage.setItem('user', JSON.stringify(res.data.user))
          const user = {
            email: res.data.user.email,
            id: res.data.user.id,
          }
          dispatch(setCurrentUser(user))
        } else {
          window.location.href = '/users/sign_in'
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
