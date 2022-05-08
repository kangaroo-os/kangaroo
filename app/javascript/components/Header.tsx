import Cookies from 'js-cookie'
import React from 'react'
import api from '../helpers/api'
import { Link, useNavigate } from 'react-router-dom'
import Dropdown from './shared/Dropdown'

export default function Header({ children }) {
  
  function logout() {
    let navigate = useNavigate()
    navigate('/login')
    api.delete('/logout').then((e) => {
      Cookies.remove('kangaroo_session_id')
    })
    return false
  }

  const menuItems = [
    { label: 'Profile', href: '/profile' },
    { label: 'Desktop', href: '/desktop' },
    { label: 'Logout', action: logout, href: '#' },
  ]

  return (
    <div className="">
      <div className=" space-x-4 fixed shadow-lg bg-gray-100 w-full p-5 flex flex-initial flex-row-reverse">
        <Dropdown menuButtonText={'Profile'} menuItems={menuItems} />
      </div>
      {children}
    </div>
  )
}
