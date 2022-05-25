import React from 'react'
import LoginSignup from './shared/LoginSignup'
import { useParams } from "react-router-dom";

export const Login = (props) => {
  debugger
  const params = useParams();
  const { chrome_auth_token } = params;
  return <LoginSignup isSignup={false} chromeExtensionAuthToken={chrome_auth_token}/>
}

export default Login
