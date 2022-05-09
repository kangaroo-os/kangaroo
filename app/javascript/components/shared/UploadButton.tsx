import React, { useRef, useState } from 'react'
import { addFile } from '../../api/cloud_files'
import Dropdown from './Dropdown'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { setUploading, addFile as addFileToState } from '../../reducers/desktopSlice'
import LinkDialogue from './LinkDialogue'

export const UploadButton = ({ ...props }) => {
  let inputRef = useRef(null)
  const [isLinkDialogueOpen, setIsLinkDialogueOpen] = useState(false)
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user.value)

  const menuItems = [
    { label: 'Upload File', action: () => inputRef.current.click() },
    { label: 'Add Link', action: () => setIsLinkDialogueOpen(true) },
    // { label: 'New Folder', action: () => console.log('new folder') },
  ]

  async function handleFileUpload(e) {
    const file = e.target.files[0]
    dispatch(setUploading(true))
    const res = await addFile(user, file)
    dispatch(setUploading(false))
    dispatch(addFileToState(res.data.file))
  }

  const MenuButton = () => (
    <div
      {...{
        ...props,
        className: `h-[60px] w-[60px] bg-orange-400 hover:bg-opacity-90 cursor-pointer rounded-full shadow-lg flex justify-center items-center ${props.className}`,
      }}
    >
      <i className="fa-solid fa-plus text-4xl text-white"></i>
      <input ref={inputRef} className="hidden" type="file" onChange={(e) => handleFileUpload(e)} />
      <LinkDialogue open={isLinkDialogueOpen} onClose={() => setIsLinkDialogueOpen(false)} />
    </div>
  )

  return <Dropdown menuButton={MenuButton()} menuItems={menuItems} />
}

export default UploadButton
