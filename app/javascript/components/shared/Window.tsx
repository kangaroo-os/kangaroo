import { useDroppable } from '@dnd-kit/core';
import React from 'react'
import Draggable from 'react-draggable'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable'

export const Window = ({ children, files, id }) => {
  const { setNodeRef } = useDroppable({
    id
  });

  return (
    <SortableContext id="folder-window" items={files} strategy={horizontalListSortingStrategy}>
      <div ref={setNodeRef} className="border border-black h-96 w-[700px] rounded-lg z-10 bg-gray-100">
        <div className="space-x-1 mx-2">
          <button className="bg-red-500 rounded-full h-3 w-3"></button>
          <button className="bg-yellow-500 rounded-full h-3 w-3"></button>
          <button className="bg-green-500 rounded-full h-3 w-3"></button>
        </div>
        {children}
      </div>
    </SortableContext>
  )
}
export default Window
