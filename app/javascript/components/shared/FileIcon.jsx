import React from 'react'
import Draggable from 'react-draggable'

export const FileIcon = ({ name, getFileCallback }) => {
  const fileCallbackType = () => {
    if (name.slice(-1) == '/') {
      return 'openFolder'
    } else {
      return 'download'
    }
  }
  return (
    <Draggable>
      <div>
        <button
          onClick={() => getFileCallback('delete', name)}
          className="hover:cursor-pointer rounded-full bg-gray-400 w-[20px] h-[20px]"
        >
          x
        </button>
        <div
          onContextMenu={(e) => {
            console.log(e)
          }}
          onDoubleClick={() => getFileCallback(fileCallbackType(), name)}
        >
          <img
            draggable={false}
            src="https://kangarooo.s3.amazonaws.com/kangaroo/fileicon.png"
            className="rounded max-h-[50px]"
          />
          <p>{name}</p>
        </div>
      </div>
    </Draggable>
  )
}

export default FileIcon
