import React, { useState } from 'react'
import api from '../helpers/api'
import csrfToken from '../helpers/csrf'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  let navigate = useNavigate()
  const [signup, setSignup] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (signup) {
      api.post('/signup', {
        authenticity_token: csrfToken(),
        user: {
          full_name: e.target.full_name.value,
          email: e.target.email.value,
          password: e.target.password.value,
        },
      })
    } else {
      api
        .post('/login', {
          authenticity_token: csrfToken(),
          user: {
            email: e.target.email.value,
            password: e.target.password.value,
            remember_me: 1,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            navigate('/desktop')
          }
        })
    }
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
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                  </a>
                </div>
                <div className="text-sm">
                  <button
                    onClick={() => {
                      setSignup(!signup)
                    }}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {signup ? 'Login intead' : 'Sign up instead'}
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
