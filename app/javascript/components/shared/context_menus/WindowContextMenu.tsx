import { useFiles } from '@states/filesState'
import React from 'react'
import { createFolder } from '@api/folder_files'
import { useContextMenu } from '@states/contextMenuState'
import { useDesktop } from '@states/desktopState'

export const WindowContextMenu = () => {
  const { getContextMenuLocation, hideContextMenu } = useContextMenu()
  const { addFile } = useDesktop()

  const [menuLocation] = getContextMenuLocation()

  async function createFolderFunction() {
    const res = await createFolder(menuLocation)
    addFile(menuLocation, res.data.file)
    hideContextMenu()
  }

  return (
    <>
      <li className="rounded hover:bg-gray-200 p-1" onClick={() => createFolderFunction()}>
        New Folder
      </li>
    </>
  )
}

export default WindowContextMenu
