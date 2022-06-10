import React, { useEffect } from 'react'
import { getUser } from '@states/userState'
import { useNavigate } from 'react-router-dom'

export const Landing = () => {
  // If the user is logged in redirect them to the desktop page
  let user = getUser()
  const navigate = useNavigate()
  useEffect(() => {
    if (user && location.pathname !== '/home') {
      navigate('/desktop')
    }
  }, [])

  return (
    <div className="lg:flex lg:flex-row-reverse max-w-[95rem] m-auto space-y-[3rem] items-center px-10 py-24 lg:py-[13rem]">
      <img src="https://kangarooo.s3.amazonaws.com/kangaroo/Browser.png" className="w-full md:max-w-[40rem] m-auto" />
      <div className="lg:w-[50%] space-y-5">
        <h1 className="lg:text-left text-center text-5xl lg:text-7xl lg:mr-2.5">Bring your desktop to the browser</h1>
        <p className="lg:text-left text-center text-xl md:text-2xl">Cloud storage that you actually want to use.</p>
      </div>
    </div>
  )
}

export default Landing
