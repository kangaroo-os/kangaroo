import React from 'react'
import Draggable from 'react-draggable'
import { getFileTypeIcon } from '../../helpers/cloud_file'
import { truncateText } from '../../helpers/utils'
import { File } from '../../models/File'

export const FileIcon = ({
  file,
  getFileCallback,
  selected,
}: {
  file: File
  getFileCallback: (arg1: string, arg2: File) => void
  selected: boolean
}) => {
  const fileCallbackType = () => {
    if (file.file_type === 'link') {
      return 'link'
    }
    if (file.name.slice(-1) == '/') {
      return 'openFolder'
    } else {
      return 'download'
    }
  }

  return (
    <Draggable>
      <div className={`${selected ? "bg-blue-100 border-2 border-blue-300" : ""} rounded p-2 m-1 inline-block`}>
        <div className="w-[100px] h-[130px]">
          <button
            onClick={() => getFileCallback('delete', file)}
            className="hover:cursor-pointer rounded-full bg-gray-400 w-[20px] h-[20px]"
          >
            x
          </button>
          <div
          className="flex justify-center items-center flex-col"
            onContextMenu={(e) => {
              console.log(e)
            }}
            onDoubleClick={() => getFileCallback(fileCallbackType(), file)}
          >
            <i className={`fa-solid fa-${getFileTypeIcon(file)} text-6xl text-orange-300`}></i>
            <p className="text-sm break-words">{truncateText(file.name, 18)}</p>
          </div>
        </div>
      </div>
    </Draggable>
  )
}

export default FileIcon
