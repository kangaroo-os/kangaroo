import React from 'react'
import { useDndMonitor } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import FileIcon from '../FileIcon'

export default function SortableFile({ id, file, selected, fileCallback }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div id={id} ref={setNodeRef} {...listeners} style={style} {...attributes}>
      <div>
        <FileIcon key={id} selected={selected} file={file} getFileCallback={fileCallback} />
      </div>
    </div>
  )
}
