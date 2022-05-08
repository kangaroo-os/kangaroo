import Cookies from 'js-cookie'
import React from 'react'
import api from '../helpers/api'
import { Link, useNavigate } from 'react-router-dom'
import Dropdown from './shared/Dropdown'

export default function Header({ children }) {
  let navigate = useNavigate()

  function logout() {
    api.delete('/logout').then((e) => {
      Cookies.remove('kangaroo_session_id')
      navigate('/login')
    })
  }

  const menuItems = [
    { label: 'Profile', href: '/profile' },
    { label: 'Desktop', href: '/desktop' },
    { label: 'Logout', action: logout },
  ]

  return (
    <div className="">
      <div className=" space-x-4 fixed shadow-lg bg-gray-100 w-full p-5 flex flex-initial flex-row-reverse">
        <Dropdown menuItems={menuItems} />
        <a href="/users/sign_up">Signup</a>
        <a className="cursor-pointer" onClick={logout}>
          Logout
        </a>
      </div>
      {children}
    </div>
  )
}
