import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Landing from './shared/Landing'

const App = () => {
  return (
    <Header>
      <div className="mt-24">
        <Landing />
        <Outlet />
      </div>
    </Header>
  )
}

export default App
