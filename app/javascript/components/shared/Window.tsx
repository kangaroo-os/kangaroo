import React, { useState } from 'react'
import { useDesktop } from '@states/desktopState'
import DroppableLocation from './desktop/DroppableLocation'
import Toggle from '@components/shared/Toggle'
import { makeFileShareable } from '@api/abstract_files'

export const Window = ({ windowId, children }) => {
  const { closeWindow, desktop } = useDesktop()
  const [isPublic, setIsPublic] = useState(false)

  function handleCloseClick() {
    closeWindow(windowId)
  }

  function toggleCallback(bool: boolean) {
    setIsPublic(bool)
    // makeFileShareable()
  }
  return (
    <div className="fixed top-[50%] left-[50%]">
      <div className="border-2 border-gray-400 h-96 w-[700px] rounded-lg z-10 bg-gray-200">
        <div className="flex items-center p-2 bg-gray-300 rounded-t-lg">
          <div className="space-x-2 mx-2">
            <button onClick={handleCloseClick} className="bg-red-500 rounded-full h-3 w-3"></button>
            <button className="bg-yellow-500 rounded-full h-3 w-3"></button>
            <button className="bg-green-500 rounded-full h-3 w-3"></button>
          </div>
          <p className="ml-5">{desktop.fileMappings[windowId].name}</p>
        </div>
        <div className="absolute bottom-0 right-0 m-5 flex items-center space-x-2">
          {isPublic && <input className="k-input-sm" readOnly />}
          <Toggle onClick={(bool) => toggleCallback(bool)} />
          <p>Public</p>
        </div>
        <DroppableLocation id={windowId} locationId={windowId} fullSize={true}>
          <div className="flex flex-row">{children}</div>
        </DroppableLocation>
      </div>
    </div>
  )
}
export default Window
