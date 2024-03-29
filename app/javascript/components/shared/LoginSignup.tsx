import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import { login, signup as signupUser, resetPassword } from '@api/auth'
import { useUser } from '../../states/userState'
import { addAuthHeaders } from '../../helpers/api'

export default function LoginSignup({ isSignup }: { isSignup: boolean }) {
  let navigate = useNavigate()
  const [signup, setSignup] = useState(isSignup)
  const [errors, setErrors] = useState(undefined)
  const [forgotPassword, setForgotPassword] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const { setCurrentUser } = useUser()

  function toggleForm() {
    setSignup(!signup)
    setForgotPassword(false)
    setErrors(undefined)
  }

  function getButtonText() {
    if (forgotPassword) {
      return 'Send reset email'
    } else if (signup) {
      return 'Sign up'
    } else {
      return 'Login'
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    let res: AxiosResponse
    // Don't resend email if we have already sent an email in the same session
    if (forgotPassword && emailSent) {
      return
    }
    if (forgotPassword) {
      try {
        res = await resetPassword(e.target.email.value)
        setEmailSent(true)
      } catch (err) {
        setErrors(err.response.data.errors.full_messages[0])
      }
    }
    // Sign up user
    else if (signup) {
      try {
        res = await signupUser(e.target.full_name.value, e.target.email.value, e.target.password.value)
        if (res.status == 200) {
          storeSessionFromAuth(res)
          navigate('/desktop')
        }
      } catch (err) {
        setErrors(err.response.data.errors.full_messages[0])
      }
    }

    // Login user
    else {
      try {
        res = await login(e.target.email.value, e.target.password.value)
        if (res.status === 200) {
          storeSessionFromAuth(res)
          navigate('/desktop')
        }
      } catch (err) {
        setErrors(err.response.data.errors[0])
      }
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
    setCurrentUser(user)
    addAuthHeaders()
    localStorage.setItem('user', JSON.stringify(user))
  }

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
            {signup && !forgotPassword && (
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

            {!forgotPassword && (
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
            )}
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button type="button" onClick={() => setForgotPassword(true)} className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </button>
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
                className={`${
                  emailSent && forgotPassword ? 'cursor-not-allowed	bg-gray-500' : 'bg-indigo-600 hover:bg-indigo-700'
                } w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {getButtonText()}
              </button>
            </div>
            {forgotPassword && emailSent && <p className="text-red-500 text-xs">Email sent! Check your email for a password reset instructions.</p>}
          </form>
        </div>
      </div>
    </div>
  )
}
