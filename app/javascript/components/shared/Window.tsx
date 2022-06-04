import { useDroppable } from '@dnd-kit/core'
import React from 'react'
import Draggable from 'react-draggable'
import { SortableContext } from '@dnd-kit/sortable'
import { useDesktop } from '@states/desktopState'

export const Window = ({ id, files, strategy, children }) => {
  const { closeWindow } = useDesktop()
  const { setNodeRef } = useDroppable({
    id: id
  })

  function handleCloseClick() {
    closeWindow(id)
  }

  return (
    <SortableContext id={id} items={files} strategy={strategy}>
      <div ref={setNodeRef} className="flex flex-wrap border border-black h-96 w-[700px] rounded-lg z-10 bg-gray-100">
        <Draggable>
          <div className="space-x-1 mx-2">
            <button onClick={handleCloseClick} className="bg-red-500 rounded-full h-3 w-3"></button>
            <button className="bg-yellow-500 rounded-full h-3 w-3"></button>
            <button className="bg-green-500 rounded-full h-3 w-3"></button>
          </div>
        </Draggable>
        {children}
      </div>
    </SortableContext>
  )
}
export default Window
