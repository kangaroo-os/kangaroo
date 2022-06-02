import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import FileIcon from '../FileIcon'

export function SortableFile({ id, file, selected, fileCallback }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div id={id} ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <FileIcon key={id} selected={selected} file={file} getFileCallback={fileCallback} />
    </div>
  )
}
