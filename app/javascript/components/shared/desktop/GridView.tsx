import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import { DndContext, rectIntersection, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable'
import { File } from '../../../models/File'
import Files from './Files'
import Window from './../Window'
import { SortableFile } from './SortableFile'
import FileIcon from '../FileIcon'
import { FileStore } from '../../../states/desktopState'

function GridView({ files, selectedFiles, fileCallback }: { files: FileStore; selectedFiles: string[]; fileCallback: () => {} }): ReactElement {
  const [fileStore, setFileStore] = useState<FileStore>(files)
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
    setFileStore(files)
  }, [files])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
    >
      <Files id="desktop" files={fileStore['desktop'] || []} strategy={rectSortingStrategy}>
        {fileStore['desktop'].map((file) => {
          const active = selectedFiles.includes(file.id)
          return <SortableFile key={file.id} id={file.id} selected={active} file={file} fileCallback={fileCallback} />
        })}
      </Files>
      {Object.entries(fileStore)
        .filter(([folderId, _]) => folderId.startsWith('folder'))
        .map(([folderId, folderItems]) => (
          <Window id={folderId} files={folderItems} strategy={rectSortingStrategy}>
            {folderItems.map((file) => {
              const active = selectedFiles.includes(file.id)
              return <SortableFile key={file.id} id={file.id} selected={active} file={file} fileCallback={fileCallback} />
            })}
          </Window>
        ))}
      <DragOverlay>
        {activeFile ? <FileIcon key={activeFile.id} selected={false} file={activeFile} getFileCallback={fileCallback} /> : null}
      </DragOverlay>
    </DndContext>
  )

  function getContainerType(id) {
    // Desktop or Windows
    const folderKeys = Object.keys(fileStore)
    if (folderKeys.includes(id)) {
      return id
    }
    // Inside folders
    return folderKeys.find((key) => fileStore[key].find((obj) => obj.id === id))
  }

  function handleDragOver() {
    document.getElementById(activeFile.id).style.opacity = '0.25'
  }

  function handleDragStart(event) {
    const { active } = event
    for (const folder in fileStore) {
      // Slow code
      const folderItems = fileStore[folder]
      const index = folderItems.findIndex((obj) => obj.id === active.id)
      if (index !== -1) {
        setActiveFile(folderItems[index])
        break
      }
    }
  }

  function handleDragEnd(event) {
    document.getElementById(activeFile.id).style.opacity = '1'

    const { active, over } = event
    const { id } = active
    const { id: overId } = over

    const activeContainer = getContainerType(id)
    const overContainer = getContainerType(overId)

    if (!activeContainer || !overContainer) {
      return
    }

    const activeIndex = fileStore[activeContainer].findIndex((file) => file.id === id)
    const overIndex = fileStore[overContainer].findIndex((file) => file.id === overId)

    if (activeContainer === overContainer) {
      setFileStore((prev) => {
        return {
          ...prev,
          [activeContainer]: arrayMove(fileStore[activeContainer], activeIndex, overIndex),
        }
      })
    } else {
      fileStore[activeContainer].splice(activeIndex, 1)
      fileStore[overContainer].splice(overIndex, 0, activeFile)
      setFileStore((prev) => {
        return {
          ...prev,
          [activeContainer]: fileStore[activeContainer],
          [overContainer]: fileStore[overContainer],
        }
      })
    }
    setActiveFile(null)
  }
}

export default GridView
