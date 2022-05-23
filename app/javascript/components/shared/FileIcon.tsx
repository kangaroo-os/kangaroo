import { useFiles } from '@states/filesState'
import React, { useRef, useState, useEffect } from 'react'
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
  const { setSelectedFiles, addSelectedFile, files, setEditingFile } = useFiles()

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

  const renameRef = useRef<HTMLTextAreaElement>(null)

  function handleSelect(e) {
    e.stopPropagation()
    if (e.metaKey || e.shiftKey) {
      addSelectedFile(file.id)
    } else {
      setSelectedFiles([file.id])
    }
  }

  function renameFile(e) {
    e.preventDefault()
    if (e.key == 'Enter' && files.selectedFiles.length == 1 && !files.editedFile) {
      setEditingFile(file.id)
    } else if (e.key == 'Enter' && files.editedFile) {
      file.name = renameRef.current.value
      setEditingFile(null)
    }
  }

  return (
    <Draggable>
      <div className={`${selected ? 'bg-blue-100 border-2 border-blue-300' : ''} rounded p-2 m-1 inline-block`}>
        <div className="w-[100px] h-[130px]">
          <button onClick={() => getFileCallback('delete', file)} className="hover:cursor-pointer rounded-full bg-gray-400 w-[20px] h-[20px]">
            x
          </button>
          <div
            tabIndex={0}
            className="flex justify-center items-center flex-col"
            onContextMenu={() => setSelectedFiles([file.id])}
            onClickCapture={(e) => handleSelect(e)}
            onKeyPress={(e) => renameFile(e)}
            onDoubleClick={() => getFileCallback(fileCallbackType(), file)}
          >
            <i className={`fa-solid fa-${getFileTypeIcon(file)} text-6xl text-orange-300`}></i>
            {files.editedFile != file.id && <p className="text-xs break-words">{truncateText(file.name, 18)}</p>}
            {files.editedFile == file.id && <textarea autoFocus ref={renameRef} defaultValue={file.name} className="text-xs w-[100px]" rows={2} />}
          </div>
        </div>
      </div>
    </Draggable>
  )
}

export default FileIcon
