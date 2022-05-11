import React, { useState, useRef } from 'react'
import Modal from './Modal'
import { addLink } from '../../api/link_files'
import { useAppDispatch } from '../../hooks'
import { addFile } from '../../reducers/desktopSlice'

export const LinkDialogue = ({ open, onClose }) => {
  const dispatch = useAppDispatch()

  async function submitLink(e) {
    e.preventDefault()
    const res = await addLink(e.target.link.value)
    dispatch(addFile(res.data.file))
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-3">
        <h1>Add a link</h1>
        <form onSubmit={(e) => submitLink(e)}>
          <input required className="k-input" type="url" id="link" name="link" />
          <div className="mr-auto space-x-2 float-right">
            <button
              type="button"
              onClick={onClose}
              className="box-content border border-gray-200 rounded p-2 min-w-[5rem]"
            >
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
