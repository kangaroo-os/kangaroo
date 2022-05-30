import React, { ReactElement, useEffect, useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { File } from '../../../models/File'

import Files from './Files'

function GridView({ files, selectedFiles, fileCallback }: { files: File[]; selectedFiles: string[]; fileCallback: () => {} }): ReactElement {
  const [items, setItems] = useState(files)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    setItems(files)
  }, [files])

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={horizontalListSortingStrategy}>
        <Files
          files={items}
          selectedFiles={selectedFiles}
          fileCallback={fileCallback}
        />
      </SortableContext>
    </DndContext>
  )

  function handleDragEnd(event) {
    const { active, over } = event

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }
}

export default GridView
