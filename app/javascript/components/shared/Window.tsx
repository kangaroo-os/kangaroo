import React from 'react'
import { useDesktop } from '@states/desktopState'
import DroppableLocation from './desktop/DroppableLocation'
import { getDefaultPath } from '@helpers/fileStorage'
import Draggable from 'react-draggable'
import { useContextMenu } from '@states/contextMenuState'

export const Window = ({ id, children }) => {
  const { closeWindow } = useDesktop()
  const { setContextMenuLocation } = useContextMenu()

  function handleCloseClick() {
    closeWindow(id)
  }

  const randomId = Math.random().toString(36).replace(/\.|\d/g, "")

  function sendElementToTop() {
    const elementId = `window-${randomId}`
    const element = document.getElementById(elementId)
    const otherWindows = document.querySelectorAll(`[data-another-window]:not(#${elementId})`)
    const maxZIndex = Array.from(otherWindows).reduce((acc, elem: any) => Math.max(elem?.style.zIndex, acc), 0)
    if (element) element.style.zIndex = `${maxZIndex + 1}`
  }

  return (
    <Draggable handle={`#w-${randomId}`}>
      <div
        onContextMenu={(e) => { e.preventDefault(); setContextMenuLocation(id, true) }}
        onMouseDownCapture={sendElementToTop}
        data-another-window={true}
        id={`window-${randomId}`}
        className="absolute top-[30%] left-[30%]"
      >
        <div className="border-2 border-gray-400 h-96 w-[700px] rounded-lg z-10 bg-gray-200">
          <div id={`w-${randomId}`} className="flex items-center p-2 bg-gray-300 rounded-t-lg">
            <div className="space-x-2 mx-2">
              <button onClick={handleCloseClick} className="bg-red-500 rounded-full h-3 w-3"></button>
              <button className="bg-yellow-500 rounded-full h-3 w-3"></button>
              <button className="bg-green-500 rounded-full h-3 w-3"></button>
            </div>
            <p className="ml-5">{id.replace(getDefaultPath(), '')}</p>
          </div>
          <DroppableLocation id={id} locationId={id} fullSize={true}>
            <div className="flex flex-row">{children}</div>
          </DroppableLocation>
        </div>
      </div>
    </Draggable>
  )
}
export default Window
