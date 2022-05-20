import React, { useRef, useState } from 'react'
import Draggable from 'react-draggable'
import { getFileTypeIcon } from '../../helpers/cloud_file'
import { truncateText } from '../../helpers/utils'
import { File } from '../../models/File'
import { useDesktop } from '../../states/desktopState'

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

  const [editing, setEditing] = useState(false)
  const renameRef = useRef<HTMLInputElement>(null)

  function handleSelect(e) {
    if (e.metaKey || e.shiftKey) {
      addSelectedFile(file.id)
    } else {
      setSelectedFiles([file.id])
    }
  }

  function renameFile(e) {
    if (e.key == 'Enter' && !editing) {
      setEditing(true)
    } else if (e.key == 'Enter' && editing) {
      file.name = renameRef.current.value
      setEditing(false)
    }
  }

  const { setSelectedFiles, addSelectedFile } = useDesktop()

  return (
    <Draggable>
      <div className={`${selected ? 'bg-blue-100 border-2 border-blue-300' : ''} rounded p-2 m-1 inline-block`}>
        <div className="w-[100px] h-[130px]">
          <button
            onClick={() => getFileCallback('delete', file)}
            className="hover:cursor-pointer rounded-full bg-gray-400 w-[20px] h-[20px]"
          >
            x
          </button>
          <div
            tabIndex={0}
            className="flex justify-center items-center flex-col"
            onContextMenu={() => setSelectedFiles([file.id])}
            onClick={(e) => handleSelect(e)}
            onKeyPress={(e) => renameFile(e)}
            onDoubleClick={() => getFileCallback(fileCallbackType(), file)}
          >
            <i className={`fa-solid fa-${getFileTypeIcon(file)} text-6xl text-orange-300`}></i>
            {!editing && <p className="text-sm break-words">{truncateText(file.name, 18)}</p>}
            {editing && <input autoFocus ref={renameRef} defaultValue={file.name} className="text-sm" type="text" />}
          </div>
        </div>
      </div>
    </Draggable>
  )
}

export default FileIcon
