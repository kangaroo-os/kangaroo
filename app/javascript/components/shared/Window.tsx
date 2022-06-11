import React from 'react'
import { useDesktop } from '@states/desktopState'
import DroppableLocation from './desktop/DroppableLocation'

export const Window = ({ id, children }) => {
  const { closeWindow } = useDesktop()

  function handleCloseClick() {
    closeWindow(id)
  }

  return (
    <div className="fixed top-[50%] left-[50%]">
      <DroppableLocation id={id} locationId={id}>
        <div className="flex flex-wrap border border-black h-96 w-[700px] rounded-lg z-10 bg-gray-100">
            <div className="space-x-1 mx-2">
              <button onClick={handleCloseClick} className="bg-red-500 rounded-full h-3 w-3"></button>
              <button className="bg-yellow-500 rounded-full h-3 w-3"></button>
              <button className="bg-green-500 rounded-full h-3 w-3"></button>
            </div>
          {children}
        </div>
      </DroppableLocation>
    </div>
  )
}
export default Window
