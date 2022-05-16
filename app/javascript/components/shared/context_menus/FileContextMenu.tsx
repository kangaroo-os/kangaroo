import React from 'react'
import { createFolder } from '../../../api/cloud_files'
import { useDesktop } from '../../../states/desktopState'

export const FileContextMenu = ({ path, callback }) => {
  async function createFolderFunction() {
    const res = await createFolder(path)
    callback(res.data.file)
  }

  const { desktop } = useDesktop()
  return (
    <>
      <li className="rounded hover:bg-gray-200 p-1" onClick={() => createFolderFunction()}>
        New Folder
      </li>
      <li className="rounded hover:bg-gray-200 p-1" onClick={() => console.log(desktop.selectedFiles)}>
        Rename
      </li>
      <li className="rounded hover:bg-gray-200 p-1" onClick={() => console.log('delete')}>
        Delete
      </li>
    </>
  )
}

export default FileContextMenu
