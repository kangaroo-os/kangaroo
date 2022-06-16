import React, { useRef, useState } from 'react'
import { addCloudFile } from '../../api/cloud_files'
import Dropdown from './Dropdown'
import LinkDialogue from './LinkDialogue'
import { useDesktop } from '../../states/desktopState'
import { getDefaultPath, getDesktopId} from '@helpers/fileStorage'
import { createFolder } from '@api/folder_files'

export const UploadButton = ({ ...props }) => {
  let inputRef = useRef(null)
  const [isLinkDialogueOpen, setIsLinkDialogueOpen] = useState(false)
  const { addFile, setUploading } = useDesktop()

  function openLinkDialogue() {
    setIsLinkDialogueOpen(true)
    setTimeout(() => {
      document.getElementById('link-input').focus()
    }, 100)
  }

  async function createFolderFunction() {
    const res = await createFolder(getDesktopId())
    addFile(getDesktopId(), res.data.file)
  }

  const menuItems = [
    { label: 'File', action: () => inputRef.current.click() },
    { label: 'Link', action: openLinkDialogue },
    { label: 'New Folder', action: () => createFolderFunction() },
  ]

  async function handleFileUpload(e) {
    for (let file of e.target.files) {
      setUploading(true)
      const res = await addCloudFile(file)
      addFile(getDesktopId(), res.data.file)
      setUploading(false)
    }
  }

  const MenuButton = () => (
    <div
      {...{
        ...props,
        className: `h-[60px] w-[120px] bg-white border-4 hover:bg-opacity-90 cursor-pointer rounded-full shadow-lg flex justify-center items-center ${props.className}`,
      }}
    >
      <i className="fa-solid fa-plus text-2xl"></i>
      <p className="mx-2">New</p>
      <input ref={inputRef} className="hidden" type="file" multiple onChange={(e) => handleFileUpload(e)} />
      <LinkDialogue open={isLinkDialogueOpen} onClose={() => setIsLinkDialogueOpen(false)} />
    </div>
  )

  return <Dropdown menuButton={MenuButton()} menuItems={menuItems} />
}

export default UploadButton
