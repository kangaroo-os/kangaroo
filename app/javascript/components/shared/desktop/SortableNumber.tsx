import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export function SortableNumber({ number }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: number })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <p key={number}>{number}</p>
    </div>
  )
}
