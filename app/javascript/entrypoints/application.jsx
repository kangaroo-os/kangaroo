import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Desktop from '@components/Desktop'
import Login from '@components/Login'
import Signup from '@components/Signup'
import Layout from '../components/Layout'
import NotFound from '@components/404'
import Landing from '../components/shared/Landing'
import ResetPassword from '@components/ResetPassword'
import ShareView from '@components/ShareView'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="home" element={<Landing />} />
          <Route path="desktop" element={<Desktop />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="reset_password" element={<ResetPassword />} />
          <Route path="share/:share_id" element={<ShareView />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
)
