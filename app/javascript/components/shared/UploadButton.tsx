import React, { useRef, useState } from 'react'
import { addCloudFile } from '../../api/cloud_files'
import Dropdown from './Dropdown'
import LinkDialogue from './LinkDialogue'
import { useDesktop } from '../../states/desktopState'

export const UploadButton = ({ ...props }) => {
  let inputRef = useRef(null)
  const [isLinkDialogueOpen, setIsLinkDialogueOpen] = useState(false)
  const { addFile, setUploading } = useDesktop()

  const menuItems = [
    { label: 'Upload File', action: () => inputRef.current.click() },
    { label: 'Add Link', action: () => { setIsLinkDialogueOpen(true);  document.getElementById('link').focus() } },
    // { label: 'New Folder', action: () => console.log('new folder') },
  ]

  async function handleFileUpload(e) {
    for (let file of e.target.files) {
      setUploading(true)
      const res = await addCloudFile(file)
      addFile(res.data.file)
      setUploading(false)
    }
  }

  const MenuButton = () => (
    <div
      {...{
        ...props,
        className: `h-[60px] w-[60px] bg-orange-400 hover:bg-opacity-90 cursor-pointer rounded-full shadow-lg flex justify-center items-center ${props.className}`,
      }}
    >
      <i className="fa-solid fa-plus text-4xl text-white"></i>
      <input ref={inputRef} className="hidden" type="file" multiple onChange={(e) => handleFileUpload(e)} />
      <LinkDialogue open={isLinkDialogueOpen} onClose={() => setIsLinkDialogueOpen(false)} />
    </div>
  )

  return <Dropdown menuButton={MenuButton()} menuItems={menuItems} />
}

export default UploadButton
