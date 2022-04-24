import React from 'react'
import Desktop from './Desktop'
import Login from './Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './Header'

const App = () => {
  return (
    <Header>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/desktop" element={<Desktop />} />
        </Routes>
      </Router>
    </Header>
  )
}

export default App
