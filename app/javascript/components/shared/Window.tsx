import { useDroppable } from '@dnd-kit/core'
import React from 'react'
import Draggable from 'react-draggable'
import { SortableContext } from '@dnd-kit/sortable'

export const Window = ({ id, files, strategy, children }) => {
  const { setNodeRef } = useDroppable({
    id: id
  })

  return (
    <SortableContext id={id} items={files} strategy={strategy}>
      <div className="flex flex-wrap border border-black h-96 w-[700px] rounded-lg z-10 bg-gray-100">
        <div className="space-x-1 mx-2">
          <button className="bg-red-500 rounded-full h-3 w-3"></button>
          <button className="bg-yellow-500 rounded-full h-3 w-3"></button>
          <button className="bg-green-500 rounded-full h-3 w-3"></button>
        </div>
        <div ref={setNodeRef}>{children}</div>
      </div>
    </SortableContext>
  )
}
export default Window
