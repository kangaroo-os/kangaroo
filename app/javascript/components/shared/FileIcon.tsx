import { useFiles } from '@states/filesState'
import React, { useRef, useState, useCallback } from 'react'
import { getFileTypeIcon } from '../../helpers/cloud_file'
import { truncateText } from '../../helpers/utils'
import { File } from '../../models/File'
import { useDropzone } from 'react-dropzone'
import { renameFile as renameFileAction, deleteFile as deleteFileAction } from '@api/files'
import { useDesktop } from '@states/desktopState'
import { renameFileValidations } from '@helpers/validations'
import { useError } from '@states/errorState'
import { useContextMenu } from '@states/contextMenuState'
import { addCloudFile } from '@api/cloud_files'
export const FileIcon = ({
  file,
  getFileCallback,
  selected,
}: {
  id?: string
  file: File
  getFileCallback: (arg1: string, arg2: File) => void
  selected: boolean
}) => {
  const { setSelectedFiles, addSelectedFile, files, setEditingFile } = useFiles()
  const { updateExistingFile, removeFile } = useDesktop()
  const { setError } = useError()
  const { setContextMenuLocation } = useContextMenu()

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
      const renameError = renameFileValidations(renameRef.current.value)
      if (renameError) {
        setError(renameError)
      } else {
        file.path = file.path.slice(0, file.path.length - file.name.length) + renameRef.current.value
        file.name = renameRef.current.value
        setEditingFile(null)
        renameFileAction(file.id, file.path).then((res) => {
          updateExistingFile(res.data.file)
        })
      }
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
      <div className={`${selected ? 'bg-blue-100 border-2 border-blue-300' : ''} rounded px-2 mx-1 py-5 inline-block`}>
        <div className="w-[75px] h-[75px] cursor-default">
          <div
            tabIndex={0}
            className="flex justify-center items-center flex-col"
            onContextMenu={() => { setSelectedFiles([file.id]); setContextMenuLocation(file.id, false) } }
            onClickCapture={(e) => handleSelect(e)}
            onKeyPress={(e) => handleKeyPress(e)}
            onKeyDown={(e) => handleKeyDown(e)}
            onKeyUp={(e) => handleKeyUp(e)}
            onDoubleClick={() => getFileCallback(fileCallbackType(), file)}
          >
            <div className="cursor-pointer w-[50px]">
              {file.icon_url ? (
                <img src={file.icon_url} className="border-2 border-gray-200 rounded max-h-24 object-fill w-[50px]" />
              ) : (
                <i className={`fa-solid fa-${getFileTypeIcon(file)} text-6xl text-orange-200`}></i>
              )}
            </div>
            {files.editedFile != file.id && <p className="text-xs break-words">{truncateText(file.name, 18)}</p>}
            {files.editedFile == file.id && <textarea autoFocus ref={renameRef} defaultValue={file.name} className="text-xs w-[100px]" rows={2} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileIcon
