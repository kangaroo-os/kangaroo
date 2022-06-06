import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import FileIcon from '../FileIcon'

export default function SortableFile({ id, file, selected, fileCallback, sortingDisabled }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id })
  
  if (sortingDisabled) {
    return (
      <div id={id} ref={setNodeRef} {...attributes}>
        <FileIcon key={id} selected={selected} file={file} getFileCallback={fileCallback} />
      </div>
    )
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div id={id} ref={setNodeRef} style={style} {...attributes} {...listeners} >
      <FileIcon key={id} selected={selected} file={file} getFileCallback={fileCallback} />
    </div>
  )
}
