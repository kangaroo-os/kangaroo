import React, { useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import Header from './Header'
import api from '../helpers/api'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '../reducers/user/userSlice'
import NotFound from './404'

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
      <h1>THIS IS THE MIAN PAGE</h1>
      <Outlet />
    </Header>
  )
}

export default App
