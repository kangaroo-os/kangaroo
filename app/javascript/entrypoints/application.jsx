import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '@store'
import App from '@components/App'
import Desktop from '@components/Desktop'
import Login from '@components/Login'
import Signup from '@components/Signup'
import Header from '../components/Header'
import NotFound from '@components/404'
import Landing from '../components/shared/Landing'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
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
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
