import React from 'react'
import { useDesktop } from '@states/desktopState'
import DroppableLocation from './desktop/DroppableLocation'
import { getDefaultPath } from '@helpers/fileStorage'
import Draggable from 'react-draggable'

export const Window = ({ id, children }) => {
  const { closeWindow } = useDesktop()

  function handleCloseClick() {
    closeWindow(id)
  }

  const randomId = Math.random().toString(36).replace(/\./g,"")

  return (
    <Draggable handle={`#draggable-${randomId}`}>
      <div className="">
          <div id={`draggable-${randomId}`} className="border-2 border-gray-400 h-96 w-[700px] rounded-lg z-10 bg-gray-200">
            <div className="flex items-center p-2 bg-gray-300 rounded-t-lg">
              <div className="space-x-2 mx-2">
                <button onClick={handleCloseClick} className="bg-red-500 rounded-full h-3 w-3"></button>
                <button className="bg-yellow-500 rounded-full h-3 w-3"></button>
                <button className="bg-green-500 rounded-full h-3 w-3"></button>
              </div>
              <p className="ml-5">{id.replace(getDefaultPath(), "")}</p>
            </div>
            <DroppableLocation id={id} locationId={id} fullSize={true}>
              <div className="flex flex-row">
              {children}
              </div>
            </DroppableLocation>
          </div>
        </div>
    </Draggable>
  )
}
export default Window
