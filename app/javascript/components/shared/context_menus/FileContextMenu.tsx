import { useFiles } from '@states/filesState'
import React from 'react'
import { createFolder } from '@api/folder_files'
import { useContextMenu } from '@states/contextMenuState'
import { useDesktop } from '@states/desktopState'
import { deleteFile } from '@api/files'
import { getDefaultPath, getDesktopId } from '@helpers/fileStorage'

export const FileContextMenu = ({ windowId }) => {
  const { files, setEditingFile } = useFiles()
  const { hideContextMenu } = useContextMenu()
  const { removeFile, addFile, desktop } = useDesktop()

  async function createFolderFunction() {
    const res = await createFolder(desktop.fileMappings[windowId].path)
    addFile(getDesktopId(), res.data.file)
  }

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
      <li className="rounded hover:bg-gray-200 p-1" onClick={() => createFolderFunction()}>
        New Folder
      </li>
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
