import Cookies from 'js-cookie'
import React from 'react'
import api from '../helpers/api'

export default function Header({ children }) {
  function logout() {
    api.delete('/users/sign_out').then((e) => {
      console.log(e)
    })
    Cookies.remove('kangaroo_session_id')
  }

  return (
    <div>
      <div className="space-x-5">
        <a href="/login">Login</a>
        <a href="/users/sign_up">Signup</a>
        <a className="cursor-pointer" onClick={logout}>
          Logout
        </a>
        {children}
      </div>
    </div>
  )
}
