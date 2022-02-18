import React from 'react'
import Draggable from 'react-draggable'

export const FileIcon = ({ name }) => {
  return (
    <Draggable>
      <div>
        <img draggable={false} src="https://kangarooo.s3.amazonaws.com/kangaroo/fileicon.png" className="rounded max-h-[50px]" />
        <p>{name}</p>
      </div>
    </Draggable>
  )
}

export default FileIcon
