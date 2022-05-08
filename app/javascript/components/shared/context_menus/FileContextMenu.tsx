import React from 'react'
import { callbackify } from 'util'
import { createFolder } from '../../../api/cloud_files'

export const FileContextMenu = ({ user, path, callback }) => {
  async function createFolderFunction() {
    const res = await createFolder(user, path)
    callback(res.data.file)
  }
  return (
    <>
      <li className="rounded hover:bg-gray-200 p-1" onClick={() => createFolderFunction()}>
        New Folder
      </li>
      <li className="rounded hover:bg-gray-200 p-1" onClick={() => console.log('rename')}>
        Rename
      </li>
      <li className="rounded hover:bg-gray-200 p-1" onClick={() => console.log('delete')}>
        Delete
      </li>
    </>
  )
}

export default FileContextMenu
