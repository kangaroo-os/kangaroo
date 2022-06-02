import React, { ReactElement, useEffect, useState } from 'react'
import { DndContext, rectIntersection, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable'
import { File } from '../../../models/File'
import Files from './Files'
import Window from './../Window'
import { SortableFile } from './SortableFile'
import FileIcon from '../FileIcon'

const sampleFolders: Bin = {
  desktop: [],
  // 'folder-1': [],
}

type Bin = {
  [key: string]: File[]
}

function GridView({ files, selectedFiles, fileCallback }: { files: File[]; selectedFiles: string[]; fileCallback: () => {} }): ReactElement {
  const [foldersWithItems, setFoldersWithItems] = useState<Bin>(sampleFolders)
  const [activeFile, setActiveFile] = useState<File>()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  )

  // Avoid in a bit
  useEffect(() => {
    setFoldersWithItems({
      ...foldersWithItems,
      desktop: files,
    })
  }, [files])

  return (
    <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragEnd={handleDragEnd} onDragStart={handleDragStart} onDragOver={handleDragOver}>
      <Files id="desktop" files={foldersWithItems['desktop']} strategy={rectSortingStrategy}>
        {foldersWithItems['desktop'].map((file) => {
          const active = selectedFiles.includes(file.id)
          return <SortableFile id={file.id} selected={active} file={file} fileCallback={fileCallback} />
        })}
      </Files>
      {Object.entries(foldersWithItems)
        .filter(([folderId, _]) => folderId.startsWith('folder'))
        .map(([folderId, folderItems]) => (
          <Window id={folderId} files={folderItems} strategy={rectSortingStrategy}>
            {folderItems.map((file) => {
              const active = selectedFiles.includes(file.id)
              return <SortableFile id={file.id} selected={active} file={file} fileCallback={fileCallback} />
            })}
          </Window>
        ))}
        <DragOverlay>{activeFile ? <FileIcon key={activeFile.id} selected={false} file={activeFile} getFileCallback={fileCallback} /> : null}</DragOverlay>
    </DndContext>
  )

  function getContainerType(id) {
    const folderKeys = Object.keys(foldersWithItems)
    if (folderKeys.includes(id)) {
      return id
    }
    return folderKeys.find((key) => foldersWithItems[key].find((obj) => obj.id === id))
  }

  function handleDragOver() {
    document.getElementById(activeFile.id).style.opacity = '0.25'
  }

  function handleDragStart(event) {
    const { active } = event;
    for (const folder in foldersWithItems) {
      const folderItems = foldersWithItems[folder]
      const index = folderItems.findIndex((obj) => obj.id === active.id)
      if (index !== -1) {
        setActiveFile(folderItems[index])
        break
      }
    }
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
    if (activeContainer === overContainer) {
      setFoldersWithItems((prev) => {
        return {
          ...prev,
          [activeContainer]: arrayMove(foldersWithItems[activeContainer], activeIndex, overIndex),
        }
      })
    } else {
      foldersWithItems[activeContainer].splice(activeIndex, 1)
      foldersWithItems[overContainer].splice(overIndex, 0, activeFile)
      setFoldersWithItems((prev) => {
        return {
          ...prev,
          [activeContainer]: foldersWithItems[activeContainer],
          [overContainer]: foldersWithItems[overContainer],
        }
      })
    }
    document.getElementById(activeFile.id).style.opacity = '1'
    setActiveFile(null)
  }
}

export default GridView
