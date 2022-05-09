import React, { useRef } from 'react'
import { addFile } from '../../../api/cloud_files'
import Dropdown from '../Dropdown'
import { useAppSelector } from '../../../hooks'

export const UploadButton = ({ ...props }) => {
  let inputRef = useRef(null)
  const user = useAppSelector((state) => state.user.value)

  const menuItems = [
    { label: 'Upload File', action: () => inputRef.current.click() },
    { label: 'Add Link', action: () => console.log('add link') },
    { label: 'New Folder', action: () => console.log('new folder') },
  ]

  async function uploadFile(file) {
    let formData = new FormData()
    formData.append('file', file)
    const res = await addFile(user, formData)
  }

  const MenuButton = () => (
    <div
      {...{
        ...props,
        className: `h-[60px] w-[60px] bg-orange-400 hover:bg-opacity-90 cursor-pointer rounded-full shadow-lg flex justify-center items-center ${props.className}`,
      }}
    >
      <i className="fa-solid fa-plus text-4xl text-white"></i>
      <input ref={inputRef} className="hidden" type="file" onChange={(e) => uploadFile(e.target.files[0])}/>
    </div>
  )

  return <Dropdown menuButton={MenuButton()} menuItems={menuItems} />
}

export default UploadButton
