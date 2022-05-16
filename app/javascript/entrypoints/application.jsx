import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Desktop from '@components/Desktop'
import Login from '@components/Login'
import Signup from '@components/Signup'
import Header from '../components/Header'
import NotFound from '@components/404'
import Landing from '../components/shared/Landing'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Header>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="home" element={<Landing />} />
          <Route path="desktop" element={<Desktop />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Routes>
      </Header>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
)
