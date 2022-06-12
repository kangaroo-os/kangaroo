import React from 'react'
export const DisappearingPopup = ({ message }: { message: string }) => {
  return (
    <div className="absolute -bottom-12 w-full animate-slide">
      <div className="py-3 px-5 bg-gray-200 rounded max-w-max mx-auto min-w-[400px]">
        <p className="text-sm">{message}</p>
      </div>
    </div>
  )
}

export default DisappearingPopup
