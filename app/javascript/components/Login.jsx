import React, { useEffect } from 'react'
import api from '../helpers/api'
import { useSelector } from 'react-redux'

const Login = () => {

  const user = useSelector((state) => state.user.value)
  console.log(user)

  return (
    <div>
      <h1 className="text-5xl text-center w-full">Root Page</h1>
    </div>
  )
}

export default Login
