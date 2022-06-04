import { useFiles } from '@states/filesState'
import React, { useRef, useState, useCallback } from 'react'
import Draggable from 'react-draggable'
import { getFileTypeIcon } from '../../helpers/cloud_file'
import { truncateText } from '../../helpers/utils'
import { File } from '../../models/File'
import { useDropzone } from 'react-dropzone'
import { renameFile as renameFileAction, deleteFile as deleteFileAction } from '@api/files'
import { useDesktop } from '@states/desktopState'

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
  const { removeFile } = useDesktop()

  function movePath(file) {
    console.log(file)
  }

  const onDrop = useCallback((acceptedFiles) => {
    for (let file of acceptedFiles) {
      movePath(file)
    }
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true, noKeyboard: true })

  const fileCallbackType = () => {
    if (file.file_type === 'link') {
      return 'link'
    }
    if (file.file_type === 'folder') {
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

  function handleKeyPress(e) {
    if (e.key == 'Enter' && files.selectedFiles.length == 1 && !files.editedFile) {
      e.preventDefault()
      setEditingFile(file.id)
    } else if (e.key == 'Enter' && files.editedFile) {
      file.path = file.path.replace(new RegExp(file.name + '$'), renameRef.current.value)
      file.name = renameRef.current.value
      setEditingFile(null)
      renameFileAction(file.id, file.path)
    }
  }

  // Delete a file by holding CMD + DELETE
  let keysPressed = {}

  function handleKeyDown(e) {
    keysPressed[e.key] = true
    if ((keysPressed['Meta'] || keysPressed['Control']) && keysPressed['Backspace'] && !files.editedFile) {
      removeFile(file.id)
      deleteFileAction(file.id)
    }
  }

  function handleKeyUp(e) {
    delete keysPressed[e.key]
  }

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div className={`${selected ? 'bg-blue-100 border-2 border-blue-300' : ''} rounded p-2 m-1 inline-block`}>
        <div className="w-[100px] h-[130px]">
          <div
            tabIndex={0}
            className="flex justify-center items-center flex-col"
            onContextMenu={() => setSelectedFiles([file.id])}
            onClickCapture={(e) => handleSelect(e)}
            onKeyPress={(e) => handleKeyPress(e)}
            onKeyDown={(e) => handleKeyDown(e)}
            onKeyUp={(e) => handleKeyUp(e)}
            onDoubleClick={() => getFileCallback(fileCallbackType(), file)}
          >
            {file.icon_url ? (
              <img src={file.icon_url} className="border-4 border-white rounded max-h-24" />
            ) : (
              <i className={`fa-solid fa-${getFileTypeIcon(file)} text-6xl text-orange-300`}></i>
            )}
            {files.editedFile != file.id && <p className="text-xs break-words">{truncateText(file.name, 18)}</p>}
            {files.editedFile == file.id && <textarea autoFocus ref={renameRef} defaultValue={file.name} className="text-xs w-[100px]" rows={2} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileIcon
