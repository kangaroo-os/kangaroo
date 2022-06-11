import Cookies from 'js-cookie'
import React from 'react'
import { removeAuthHeaders } from '../helpers/api'
import { Link, useNavigate } from 'react-router-dom'
import Dropdown from './shared/Dropdown'
import { logout as logoutUser } from '../api/auth'
import { getUser, useUser } from '../states/userState'

export default function Header({ children }) {
  let navigate = useNavigate()

  const user = getUser()

  const { removeCurrentUser } = useUser()

  async function logout() {
    await logoutUser(user)
    navigate('/login')
    Cookies.remove('kangaroo_session_id')
    localStorage.removeItem('user')
    removeCurrentUser()
    removeAuthHeaders()
    return false
  }

  const menuItems = [
    { label: 'Desktop', href: '/desktop' },
    { label: 'Logout', action: logout },
  ]

  const MenuButton = () => (
    <div>
      {user.fullName}
      <i className="fa-solid fa-chevron-down text-sm ml-2 inline-block" aria-hidden="true"></i>
    </div>
  )

  return (
    <div>
      <div className="bg-opacity-50 z-50 space-x-4 fixed top-0 shadow-lg bg-gray-100 w-full px-[10px] py-3 flex flex-initial flex-row-reverse items-center">
        {user ? (
          <Dropdown menuButton={MenuButton()} menuItems={menuItems} />
        ) : (
          <div className="space-x-5">
            <Link to="/login" className="text-gray-700">
              Login
            </Link>
            <div className="border-2 border-orange-500 inline-block rounded p-2 bg-orange-100">
              <Link to="/signup" className="text-gray-700">
                Sign Up
              </Link>
            </div>
          </div>
        )}
        <div className="flex-grow flex items-center space-x-4">
          {/* <Link to={user ? '/home' : '/'}>
            <div className="bg-gray-200 h-[45px] w-[45px] rounded-full inline-block"></div>
          </Link> */}
          <Link to={user ? '/home' : '/'} className="inline-block text-lg font-medium">
            Kangaroo
          </Link>
        </div>
      </div>
      <div className="">{children}</div>
    </div>
  )
}
