import { useFiles } from '@states/filesState'
import React from 'react'
import { useContextMenu } from '@states/contextMenuState'
import { useDesktop } from '@states/desktopState'
import { deleteFile } from '@api/files'

export const FileContextMenu = () => {
  const { files, setEditingFile } = useFiles()
  const { hideContextMenu } = useContextMenu()
  const { removeFile } = useDesktop()

  function handleRename(e) {
    e.stopPropagation()
    if (files.selectedFiles.length == 1) {
      setEditingFile(files.selectedFiles[0])
    }
    hideContextMenu()
  }

  function handleDelete(e) {
    e.stopPropagation()
    if (files.selectedFiles.length == 1) {
      removeFile(files.selectedFiles[0])
      deleteFile(files.selectedFiles[0])
    }
    hideContextMenu()
  }

  return (
    <>
      <li className="rounded hover:bg-gray-200 p-1" onClickCapture={(e) => handleRename(e)}>
        Rename
      </li>
      <li className="rounded hover:bg-gray-200 p-1" onClickCapture={(e) => handleDelete(e)}>
        Delete
      </li>
    </>
  )
}

export default FileContextMenu
