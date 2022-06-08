import React, { ReactElement, useEffect, useState } from 'react'
import { DndContext, pointerWithin, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy } from '@dnd-kit/sortable'
import { File } from '../../../models/File'
import Files from './Files'
import Window from './../Window'
import SortableFile from './SortableFile'
import FileIcon from '../FileIcon'
import { FileStore, useDesktop } from '../../../states/desktopState'

function GridView({ fileStore, selectedFiles, fileCallback }: { fileStore: FileStore; selectedFiles: string[]; fileCallback: () => {} }): ReactElement {
  const { setWindowFiles, addFile, removeFile } = useDesktop()
  const [activeFile, setActiveFile] = useState<File>()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
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

  function getWindowIdAndFileIndex(id) {
    const windowIds = Object.keys(fileStore)
    if (windowIds.includes(id)) return [id, null]
    for (const windowId of windowIds) {
      const fileIndex = fileStore[windowId].findIndex(file => file.id === id)
      if (fileIndex >= 0) {
        return [windowId, fileIndex]
      }
    }
    return [null, null]
  }

  // Beware of slow code.
  function handleDragOver(event) {
    document.getElementById(activeFile.id).style.opacity = '0.25'
    const { over, active } = event
    console.log(active)
    console.log(over)
    if (!over) return

    const { id: overId } = over

    // Same file over same file
    if (activeFile.id === overId) return

    const [activeContainer, activeIndex] = getWindowIdAndFileIndex(activeFile.id)
    const [overContainer, overIndex] = getWindowIdAndFileIndex(overId)
    if (!activeContainer || !activeIndex || !overContainer || !overIndex) {
      return
    }

    const overFile = fileStore[overContainer][overIndex]
    if (overFile.file_type === 'folder') {
      // TODO: Somehow have folder stay at the same spot and wait for the file to be dragged in
    } else {
    }

    setWindowFiles(activeContainer, arrayMove(fileStore[activeContainer], activeIndex, overIndex))
  }

  function handleDragStart(event) {
    const { active } = event
    for (const folder in fileStore) {
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

    // Don't do anything if file is dropped back at the same place
    if (id === overId) return

    const [activeContainer, activeIndex] = getWindowIdAndFileIndex(id)
    const [overContainer, overIndex] = getWindowIdAndFileIndex(overId)

    if (!activeContainer || !overContainer) return

    // Don't allow dragging folder into its own window
    if (overContainer === `folder-${activeFile.path}`) return

    // Check if user dragged item inside a folder
    if (overIndex) {
      const overFile = fileStore[overContainer][overIndex]
      // User drags item inside a folder icon, put it inside the folder
      if (overFile.file_type === 'folder') {
        removeFile(activeFile.id)
        // TODO: Update path on backend instead of add file
        // We don't need to show where the file went
        // Get rid of following line later
        addFile(`folder-${overFile.path}`, activeFile)
        setActiveFile(null)
        return
      }
    }

    // If user rearranges files within same container, then change the order
    // Else move the file into the window
    if (activeContainer === overContainer) {
      // TODO BACKEND: Change the order
      setWindowFiles(activeContainer, arrayMove(fileStore[activeContainer], activeIndex, overIndex))
    } else {
      // TODO: Update files' paths
      fileStore[activeContainer].splice(activeIndex, 1)
      fileStore[overContainer].splice(overIndex, 0, activeFile)
      setWindowFiles(activeContainer, fileStore[activeContainer])
      setWindowFiles(overContainer, fileStore[overContainer])
    }

    setActiveFile(null)
  }
}

export default GridView
