import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'

const App = () => {
  return (
    <Header>
      <div className="mt-24">
        <Outlet />
      </div>
    </Header>
  )
}

export default App
