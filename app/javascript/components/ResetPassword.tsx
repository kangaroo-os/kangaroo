import React from 'react'

export const ResetPassword = () => {
  return (
    <div>
      <h1>Reset your password</h1>
      <form>
        <label htmlFor="password">New password</label>
        <input type="password" id="password" />
        <label htmlFor="confirmPassword">Confirm password</label>
        <input type="password" id="confirmPassword" />
        <button type="submit">Reset password</button>
      </form>
    </div>
  )
}

export default ResetPassword
