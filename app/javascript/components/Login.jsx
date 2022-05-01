import React, { useEffect } from 'react'
import api from '../helpers/api'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '../features/user/userSlice'
import { useSelector } from 'react-redux'

const Login = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    api.post('/authorized').then((res) => {
      if (!res.data.user) {
        window.location.href = '/users/sign_in'
        return null
      } else {
        const user = {
          email: res.data.user.email,
          id: res.data.user.id,
        }
        dispatch(setCurrentUser(user))
        return null
      }
    })
  }, [])
  
  const user = useSelector((state) => state.user.value)
  console.log(user)

  return (
    <div>
      <h1 className="text-5xl text-center w-full">Root Page</h1>
    </div>
  )
}

export default Login
