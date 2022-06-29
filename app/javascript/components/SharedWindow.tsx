import React from 'react'

export const SharedWindow = ({ windowId, children }) => {

  return (
      <div
        data-another-window={true}
        className="absolute top-[30%] left-[30%]"
      >
        <div className="border-2 border-gray-400 h-96 w-[700px] rounded-lg z-10 bg-gray-200">
          <div className="flex items-center p-2 bg-gray-300 rounded-t-lg">
            <div className="space-x-2 mx-2">
              <button className="bg-gray-500 rounded-full h-3 w-3"></button>
              <button className="bg-gray-500 rounded-full h-3 w-3"></button>
              <button className="bg-gray-500 rounded-full h-3 w-3"></button>
            </div>
            <p className="ml-5">{windowId}</p>
          </div>
          {children}
        </div>
      </div>
  )
}
export default SharedWindow
