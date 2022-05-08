import React from 'react'
import Draggable from 'react-draggable'
import { getFileTypeIcon } from '../../helpers/cloud_file'
import { truncateText } from '../../helpers/utils'

export const FileIcon = ({ file, getFileCallback }) => {
  const fileCallbackType = () => {
    if (file.name.slice(-1) == '/') {
      return 'openFolder'
    } else {
      return 'download'
    }
  }

  console.log(file)
  return (
    <Draggable>
      <div className="w-[100px] h-[130px] inline-block">
        <button
          onClick={() => getFileCallback('delete', file.id)}
          className="hover:cursor-pointer rounded-full bg-gray-400 w-[20px] h-[20px]"
        >
          x
        </button>
        <div
          onContextMenu={(e) => {
            console.log(e)
          }}
          onDoubleClick={() => getFileCallback(fileCallbackType(), file.id)}
        >
          <i className={`fa-solid fa-${getFileTypeIcon(file)} text-6xl text-orange-300`}></i>
          <p className="text-sm break-words">{truncateText(file.name, 18)}</p>
        </div>
      </div>
    </Draggable>
  )
}

export default FileIcon
