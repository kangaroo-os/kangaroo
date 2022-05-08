import React, { useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import Header from './Header'
import api from '../helpers/api'
import { useAppDispatch } from '../hooks'
import { setCurrentUser } from '../reducers/user/userSlice'
import NotFound from './404'

const App = () => {
  const dispatch = useAppDispatch()

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
          // window.location.href = '/login'
        }
      })
    }
  }, [])

  return (
    <Header>
      <Outlet />
    </Header>
  )
}

export default App
