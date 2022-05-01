import React from 'react'
import api from '../helpers/api'

export default function Header({ children }) {
  function logout() {
    api.delete('/users/sign_out').then((e) => {
      console.log(e)
    })
  }

  return (
    <div>
      <div className="space-x-5">
        <a href="/users/sign_in">Login</a>
        <a href="/users/sign_up">Signup</a>
        <a className="cursor-pointer" onClick={logout}>
          Logout
        </a>
        {children}
      </div>
    </div>
  )
}