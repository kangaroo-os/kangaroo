import React from 'react'
import Draggable from 'react-draggable'

export const Window = ({ children }) => {
  return (
    <Draggable>
      <div className="border border-black h-96 w-[700px] rounded-lg z-10 bg-gray-100">
        <div className="space-x-1 mx-2">
          <button className="bg-red-500 rounded-full h-3 w-3"></button>
          <button className="bg-yellow-500 rounded-full h-3 w-3"></button>
          <button className="bg-green-500 rounded-full h-3 w-3"></button>
        </div>
        {children}
      </div>
    </Draggable>
  )
}
