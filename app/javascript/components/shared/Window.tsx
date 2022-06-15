import React, { useRef, useState } from 'react'
import { useDesktop } from '@states/desktopState'
import DroppableLocation from './desktop/DroppableLocation'
import Toggle from '@components/shared/Toggle'
import { makeFileShareable } from '@api/abstract_files'
import { getDefaultPath } from '@helpers/fileStorage'
import Draggable from 'react-draggable'
import { sleep } from '@helpers/sleep'

export const Window = ({ windowId, children }) => {
  const { closeWindow, desktop } = useDesktop()
  const shareRef = useRef<HTMLInputElement>()
  const [showCopied, setShowCopied] = useState(false)
  const [isPublic, setIsPublic] = useState(desktop.fileMappings[windowId].publicly_accessible)
  const [publicUrl, setPublicUrl] = useState(desktop.fileMappings[windowId].public_share_url || '')

  function handleCloseClick() {
    closeWindow(windowId)
  }

  async function toggleCallback(bool: boolean) {
    setIsPublic(bool)
    const res = await makeFileShareable(windowId, bool)
    if (res.status === 200) {
      setPublicUrl(res.data.file.public_share_url)
    }
  }

  const randomId = Math.random().toString(36).replace(/\.|\d/g, '')

  function sendElementToTop() {
    const elementId = `window-${randomId}`
    const element = document.getElementById(elementId)
    const otherWindows = document.querySelectorAll(`[data-another-window]:not(#${elementId})`)
    const maxZIndex = Array.from(otherWindows).reduce((acc, elem: any) => Math.max(elem?.style.zIndex, acc), 0)
    if (element) element.style.zIndex = `${maxZIndex + 1}`
  }

  async function copyInputText() {
    shareRef.current.select()
    shareRef.current.setSelectionRange(0, 99999) /* For mobile devices */
    navigator.clipboard.writeText(shareRef.current.value)
    setShowCopied(true)
    await sleep(2000)
    setShowCopied(false)
  }

  return (
    <Draggable handle={`#w-${randomId}`}>
      <div onMouseDownCapture={sendElementToTop} data-another-window={true} id={`window-${randomId}`} className="absolute top-[30%] left-[30%]">
        <div className="border-2 border-gray-400 h-96 w-[700px] rounded-lg z-10 bg-gray-200">
          <div id={`w-${randomId}`} className="flex items-center p-2 bg-gray-300 rounded-t-lg">
            <div className="space-x-2 mx-2">
              <button onClick={handleCloseClick} className="bg-red-500 rounded-full h-3 w-3"></button>
              <button className="bg-yellow-500 rounded-full h-3 w-3"></button>
              <button className="bg-green-500 rounded-full h-3 w-3"></button>
            </div>
            <p className="ml-5">{desktop.fileMappings[windowId].name.replace(getDefaultPath(), '')}</p>
          </div>
          <div className="absolute bottom-0 right-0 m-5">
            <div className="flex items-center space-x-2">
              {isPublic && (
                <input
                  onClick={copyInputText}
                  ref={shareRef}
                  value={publicUrl}
                  className="pl-7 k-input-sm cursor-pointer bg-gray-300 hover:bg-white hover:border-2 hover:border-blue-500"
                  readOnly
                />
              )}
              {showCopied && <i className="absolute fa-solid fa-circle-check text-green-700"></i>}
              {!showCopied && <i className="absolute fa-regular fa-clipboard text-gray-500"></i>}
              <Toggle onClick={(bool) => toggleCallback(bool)} enabled={!!desktop.fileMappings[windowId].publicly_accessible} />
              <p>Public</p>
            </div>
          </div>
          <DroppableLocation id={windowId} locationId={windowId} fullSize={true}>
            <div className="flex flex-row">{children}</div>
          </DroppableLocation>
        </div>
      </div>
    </Draggable>
  )
}
export default Window
