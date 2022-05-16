import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import { login, signup as signupUser } from '../../api/auth'
import { useAppDispatch } from '../../hooks'
import { setCurrentUser } from '../../reducers/userSlice'
import { addAuthHeaders } from '../../helpers/api'

export default function LoginSignup({ isSignup }: { isSignup: boolean }) {
  let navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [signup, setSignup] = useState(isSignup)
  const [errors, setErrors] = useState(undefined)

  function toggleForm() {
    setSignup(!signup)
    setErrors(undefined)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    let res: AxiosResponse
    // Sign up user
    if (signup) {
      try {
        res = await signupUser(e.target.full_name.value, e.target.email.value, e.target.password.value)
      } catch (err) {
        setErrors(err.response.data.errors.full_messages[0])
      }
    }

    // Login user
    else {
      try {
        res = await login(e.target.email.value, e.target.password.value)
      } catch (err) {
        setErrors(err.response.data.errors[0])
      }
    }
    if (res.status === 200) {
      storeSessionFromAuth(res)
      navigate('/desktop')
    }
  }

  function storeSessionFromAuth(res: AxiosResponse<any, any>) {
    const user = {
      id: res.data.data.id,
      email: res.data.data.email,
      fullName: res.data.data.full_name,
      client: res.headers.client,
      accessToken: res.headers['access-token'],
      tokenExpiresAt: res.headers['expiry'],
    }
    dispatch(setCurrentUser(user))
    localStorage.setItem('user', JSON.stringify(user))
    addAuthHeaders()
  }

  return (
    <>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
              {signup && (
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                {errors && <p className="text-red-500 text-xs mt-2">{errors}</p>}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                  </a>
                </div>
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      toggleForm()
                    }}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {signup ? 'Login instead' : 'Sign up instead'}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {signup ? 'Sign up' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
