import { sleep } from '@helpers/sleep'
import React, { useRef, useState } from 'react'
import Toggle from '../Toggle'

export const SharedWindow = ({ rootFile, children }) => {
  const shareRef = useRef<HTMLInputElement>()
  const [showCopied, setShowCopied] = useState(false)

  async function copyInputText() {
    shareRef.current.select()
    shareRef.current.setSelectionRange(0, 99999) /* For mobile devices */
    navigator.clipboard.writeText(shareRef.current.value)
    setShowCopied(true)
    await sleep(2000)
    setShowCopied(false)
  }

  return (
    <div data-another-window={true} className="absolute top-[30%] left-[30%]">
      <div className="border-2 border-gray-400 h-96 w-[700px] rounded-lg z-10 bg-gray-200">
        <div className="flex items-center p-2 bg-gray-300 rounded-t-lg">
          <div className="space-x-2 mx-2">
            <button className="bg-gray-500 rounded-full h-3 w-3"></button>
            <button className="bg-gray-500 rounded-full h-3 w-3"></button>
            <button className="bg-gray-500 rounded-full h-3 w-3"></button>
          </div>
          <p className="ml-5">{rootFile?.name}</p>
        </div>

        <div className="absolute bottom-0 right-0 m-5">
          <div className="flex items-center space-x-2">
            <input
              onClick={copyInputText}
              ref={shareRef}
              value={`${location.host}/pouch/${rootFile?.public_share_url}`}
              className="pl-7 k-input-sm cursor-pointer bg-gray-300 hover:bg-white hover:border-2 hover:border-blue-500"
              readOnly
            />
            {showCopied && <i className="absolute fa-solid fa-circle-check text-green-700"></i>}
            {!showCopied && <i className="absolute fa-regular fa-clipboard text-gray-500"></i>}
            <Toggle onClick={() => null} enabled={true} enforce/>
            <p>Public</p>
          </div>
        </div>
        <div className="flex flex-row">{children}</div>
      </div>
    </div>
  )
}
export default SharedWindow
