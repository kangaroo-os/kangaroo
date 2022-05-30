import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import FileIcon from '../FileIcon'

export function SortableFile({ file, selected, fileCallback }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: file.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <FileIcon key={file.id} selected={selected} file={file} getFileCallback={fileCallback} />
      <p>{file.id}</p>
    </div>
  )
}
