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
    // if (!params['uid']) {
    //   navigate('/signup')
    //   return
    // }
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
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
            <h1 className="text-lg">Reset your password</h1>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                New password
              </label>
              <input
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                type="password"
                id="password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                Confirm password
              </label>
              <input
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                type="password"
                id="confirmPassword"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset password
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
