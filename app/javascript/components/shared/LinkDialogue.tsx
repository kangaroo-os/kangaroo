import React, { useRef } from 'react'
import Modal from './Modal'
import { addLink } from '../../api/link_files'
import { useDesktop } from '../../states/desktopState'
import { addHttp } from '@helpers/text'

export const LinkDialogue = ({ open, onClose }) => {
  const { addFile } = useDesktop()
  const inputRef = useRef<HTMLInputElement>()

  async function submitLink(e) {
    e.preventDefault()
    const res = await addLink(e.target.link.value)
    addFile('desktop', res.data.file)

    onClose()
  }

  function handleTextChange(e) {
    let url = addHttp(e.target.value)
    inputRef.current.value = url
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-3">
        <h1>Add a link</h1>
        <form onSubmit={(e) => submitLink(e)}>
          <input required onChange={(e) => handleTextChange(e)} ref={inputRef} className="k-input" type="url" id="link" name="link" />
          <div className="mr-auto space-x-2 float-right mt-3">
            <button type="button" onClick={onClose} className="box-content border border-gray-200 rounded p-2 min-w-[5rem]">
              Cancel
            </button>
            <button type="submit" className="bg-orange-300 rounded p-2 min-w-[5rem]">
              Add
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default LinkDialogue
