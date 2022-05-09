import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Landing from './shared/Landing'

const App = () => {
  return (
    <Header>
      <Landing />
      <Outlet />
    </Header>
  )
}

export default App
