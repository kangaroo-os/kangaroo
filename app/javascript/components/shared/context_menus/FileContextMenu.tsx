import { useFiles } from '@states/filesState'
import React from 'react'
import { createFolder } from '@api/folder_files'
import { useContextMenu } from '@states/contextMenuState'
import { useDesktop } from '@states/desktopState'
import { deleteFile } from '@api/files'

export const FileContextMenu = ({ path, callback }) => {
  const { files, setEditingFile } = useFiles()
  const { hideContextMenu } = useContextMenu()
  const { removeFile } = useDesktop()

  async function createFolderFunction() {
    const res = await createFolder(path)
    callback(res.data.file)
  }

  function handleRename(e) {
    e.stopPropagation()
    if (files.selectedFiles.length == 1) {
      setEditingFile(files.selectedFiles[0])
    }
    hideContextMenu()
}

  // TODO: this function doesn't work cuz when you click outside of the file icon it unselects all the selected files. 
  function handleDelete(e) {
    e.stopPropagation()
    if (files.selectedFiles.length == 1) {
      deleteFile(files.selectedFiles[0])
      removeFile(files.selectedFiles[0])
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
      <li className="rounded hover:bg-gray-200 p-1" onClick={(e) => handleDelete(e)}>
        Delete
      </li>
    </>
  )
}

export default FileContextMenu
