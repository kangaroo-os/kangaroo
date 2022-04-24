import React from 'react'

export const FileList = () => {
  return (
    <>
      <li className="rounded hover:bg-gray-200 p-1" onClick={() => console.log('rename')}>Rename</li>
      <li className="rounded hover:bg-gray-200 p-1" onClick={() => console.log('delete')}>Delete</li>
    </>
  )
}

export default FileList
