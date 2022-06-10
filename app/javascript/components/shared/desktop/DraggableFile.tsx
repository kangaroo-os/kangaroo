import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import FileIcon from '../FileIcon'

export default function DraggableFile({ id, file, selected, fileCallback }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
  }

  return (
    <div id={id} ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <FileIcon key={id} selected={selected} file={file} getFileCallback={fileCallback} />
    </div>
  )
}
