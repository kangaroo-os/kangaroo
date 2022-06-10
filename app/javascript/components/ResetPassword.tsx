import React, { useEffect } from 'react'
import params from '@helpers/params'
import { useUser } from '@states/userState'
import { addAuthHeaders } from '@helpers/api'
import { updatePassword } from '@api/auth'
import { useNavigate } from 'react-router-dom'

export const ResetPassword = () => {
  const { setCurrentUser } = useUser()
  let navigate = useNavigate()

  useEffect(() => {
    const user = {
      id: null,
      email: params['uid'],
      fullName: null,
      client: params['client'],
      accessToken: params['access-token'],
      tokenExpiresAt: params['expiry'],
    }
    setCurrentUser(user)
    addAuthHeaders()
  }, [params])

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await updatePassword(e.target.password.value)
    if (res.status === 200) {
      const user = {
        id: res.data.data.id,
        email: res.data.data.email,
        fullName: res.data.data.full_name,
        client: res.headers.client,
        accessToken: res.headers['access-token'],
        tokenExpiresAt: res.headers['expiry'],
      }
      setCurrentUser(user)
      addAuthHeaders()
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/desktop')
    }
  }

  return (
    <div>
      <h1>Reset your password</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="password">New password</label>
        <input type="password" id="password" />
        <label htmlFor="confirmPassword">Confirm password</label>
        <input type="password" id="confirmPassword" />
        <button type="submit">Reset password</button>
      </form>
    </div>
  )
}

export default ResetPassword
