import React from 'react'
import { useState } from 'react'

export const Toggle = ({ onClick }) => {
  const [enabled, setEnabled] = useState(false)

  function handleClick() {
    onClick(!enabled)
    setEnabled(!enabled)
  }

  return (
    <div className="flex items-center">
      <button
        onClick={handleClick}
        type="button"
        className={`${
          enabled ? 'bg-blue-400 border-blue-500' : 'border-gray-400 bg-gray-300'
        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out border-1 duration-200 `}
        role="switch"
        aria-checked={enabled}
        aria-labelledby="annual-billing-label"
      >
        <span
          aria-hidden="true"
          className={`${
            enabled ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
        ></span>
      </button>
    </div>
  )
}

export default Toggle
