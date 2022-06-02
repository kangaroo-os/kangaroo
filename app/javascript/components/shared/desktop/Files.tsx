import React, { ReactElement } from 'react'
import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

export const Files = ({ id, files, strategy, children }): ReactElement => {
  const { setNodeRef } = useDroppable({
    id: id
  })

  return (
    <SortableContext id={id} items={files} strategy={strategy}>
      <div ref={setNodeRef} className="flex flex-wrap">
        {children}
      </div>
    </SortableContext>
  )
}

export default Files
