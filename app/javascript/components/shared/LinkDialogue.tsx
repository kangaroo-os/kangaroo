import React, { useState } from 'react'
import Modal from './Modal'

export const LinkDialogue = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-3">
        <h1>Add a link</h1>
        <input className="k-input" type="url" />
        <div className="mr-auto space-x-2 float-right">
          <button onClick={onClose} className="box-content border border-gray-200 rounded p-2 min-w-[5rem]">
            Cancel
          </button>
          <button className="bg-orange-300 rounded p-2 min-w-[5rem]">Add</button>
        </div>
      </div>
    </Modal>
  )
}

export default LinkDialogue
