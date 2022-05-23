import { useFiles } from '@states/filesState'
import React from 'react'
import { createFolder } from '../../../api/cloud_files'

export const FileContextMenu = ({ path, callback }) => {
  const { files, setEditingFile } = useFiles()
  async function createFolderFunction() {
    const res = await createFolder(path)
    callback(res.data.file)
  }

  function handleRename(e) {
    e.stopPropagation()
    if (files.selectedFiles.length == 1) {
      setEditingFile(files.selectedFiles[0])
    }
  }

  return (
    <>
      <li className="rounded hover:bg-gray-200 p-1" onClick={() => createFolderFunction()}>
        New Folder
      </li>
      <li className="rounded hover:bg-gray-200 p-1" onClickCapture={(e) => handleRename(e)}>
        Rename
      </li>
      <li className="rounded hover:bg-gray-200 p-1" onClick={() => console.log('delete')}>
        Delete
      </li>
    </>
  )
}

export default FileContextMenu
