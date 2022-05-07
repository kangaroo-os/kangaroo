import React, { useEffect } from 'react'
import api from '../helpers/api'
import { useSelector } from 'react-redux'

const Login = () => {

  const user = useSelector((state) => state.user.value)
  console.log(user)

  return (
    <div className="center">
      <h1 className="text-5xl text-center w-full">Root Page</h1>
      <a href="/desktop" className="text-5xl text-center w-full">Desktop</a>
    </div>
  )
}

export default Login
