import React, { ReactElement, useEffect, useState } from 'react'
import { DndContext, rectIntersection, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { File } from '../../../models/File'
import Files from './Files'
import Window from './../Window'
import { SortableFile } from './SortableFile'

const sampleFolders: Bin = {
  desktop: [],
  // 'folder-1': [
    // {
    //   id: 'file-1-1',
    // },
    // {
    //   id: 'file-1-2',
    // },
    // ],
    // 'folder-2': [
    // {
    //   id: 'file-2-1',
    // },
    // {
    //   id: 'file-2-2',
    // },
  // ],
}

type Bin = {
  [key: string]: File[]
}

function GridView({ files, selectedFiles, fileCallback }: { files: File[]; selectedFiles: string[]; fileCallback: () => {} }): ReactElement {
  const [foldersWithItems, setFoldersWithItems] = useState<Bin>(sampleFolders)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10
      }
    })
  )

  // Avoid in a bit
  useEffect(() => {
    setFoldersWithItems({
      ...foldersWithItems,
      desktop: files,
    })
  }, [files])

  return (
    <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragEnd={handleDragEnd}>
      <Files id="desktop" files={foldersWithItems['desktop']} strategy={horizontalListSortingStrategy}>
        {foldersWithItems['desktop'].map((file) => {
          const active = selectedFiles.includes(file.id)
          console.log(file.id)
          return <SortableFile key={file.id} selected={active} file={file} fileCallback={fileCallback} />
        })}
      </Files>
      {Object.entries(foldersWithItems)
        .filter(([folderId, _]) => folderId.startsWith('folder'))
        .map(([folderId, folderItems]) => (
          <Window id={folderId} files={folderItems} strategy={horizontalListSortingStrategy}>
            {folderItems.map((file) => {
              const active = selectedFiles.includes(file.id)
              return <SortableFile key={file.id} selected={active} file={file} fileCallback={fileCallback} />
            })}
          </Window>
        ))}
    </DndContext>
  )

  function getContainerType(id) {
    return Object.keys(foldersWithItems).find((key) => foldersWithItems[key].find((obj) => obj.id === id))
  }

  function handleDragEnd(event) {
    const { active, over } = event
    const { id } = active
    const { id: overId } = over

    const activeContainer = getContainerType(id)
    const overContainer = getContainerType(overId)

    if (!activeContainer || !overContainer) {
      return
    }

    const activeIndex = foldersWithItems[activeContainer].findIndex((file) => file.id === id)
    const overIndex = foldersWithItems[overContainer].findIndex((file) => file.id === overId)
    debugger
    if (activeContainer === overContainer) {
      const newFiles = arrayMove(foldersWithItems[activeContainer], activeIndex, overIndex)
      setFoldersWithItems((prev) => {
        return {
          ...prev,
          [activeContainer]: newFiles,
        }
      })
    } else {
      debugger
      foldersWithItems[activeContainer].splice(activeIndex, 1)
      foldersWithItems[overContainer].splice(overIndex, 0, active)
      setFoldersWithItems((prev) => {
        return {
          ...prev,
          [activeContainer]: foldersWithItems[activeContainer],
          [overContainer]: foldersWithItems[overContainer],
        }
      })
    }
  }
}

export default GridView
