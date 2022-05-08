import Cookies from 'js-cookie'
import React from 'react'
import api from '../helpers/api'
import { Link, useNavigate } from 'react-router-dom'
import Dropdown from './shared/Dropdown'
import { useAppSelector, useAppDispatch } from '../hooks'
import { setCurrentUser } from '../reducers/user/userSlice'
import { logout as logoutUser } from '../api/auth'

export default function Header({ children }) {
  let navigate = useNavigate()

  const user = useAppSelector((state) => state.user.value)
  const dispatch = useAppDispatch()

  async function logout() {
    await logoutUser(user)
    Cookies.remove('kangaroo_session_id')
    sessionStorage.removeItem('user')
    dispatch(setCurrentUser(undefined))
    navigate('/login')
    return false
  }

  const menuItems = [
    { label: 'Profile', href: '/profile' },
    { label: 'Desktop', href: '/desktop' },
    { label: 'Logout', action: logout, href: '#' },
  ]

  return (
    <div className="">
      <div className=" space-x-4 fixed top-0 shadow-lg bg-gray-100 w-full p-5 flex flex-initial flex-row-reverse items-center">
        {user ? (
          <Dropdown menuButtonText={'Profile'} menuItems={menuItems} />
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
          <Link to="/">
            <div className="bg-gray-200 h-[45px] w-[45px] rounded-full inline-block"></div>
          </Link>
          <Link to="/" className="inline-block text-2xl font-medium">
            Kangaroo
          </Link>
        </div>
      </div>
      <div className="mt-24">{children}</div>
    </div>
  )
}
