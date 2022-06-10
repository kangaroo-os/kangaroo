import React, { ReactElement, useEffect, useState } from 'react'
import { DndContext, pointerWithin, PointerSensor, useSensor, useSensors, DragOverlay, useDroppable } from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy } from '@dnd-kit/sortable'
import { File } from '../../../models/File'
import Files from './Files'
import Window from './../Window'
import DraggableFile from './DraggableFile'
import FileIcon from '../FileIcon'
import { FileStore, useDesktop } from '../../../states/desktopState'
import DroppableLocation from './DroppableLocation'

function GridView({
  fileStore,
  selectedFiles,
  fileCallback,
}: {
  fileStore: FileStore
  selectedFiles: string[]
  fileCallback: () => {}
}): ReactElement {
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
      <Files id="desktop">
        {fileStore['desktop'].map((file) => {
          const active = selectedFiles.includes(file.id)
          return (
            <DroppableLocation id={`droppable-${file.id}`} locationId={file.id}>
              <DraggableFile key={file.id} id={file.id} selected={active} file={file} fileCallback={fileCallback} />
            </DroppableLocation>
          )
        })}
      </Files>
      {Object.entries(fileStore)
        .filter(([folderId, _]) => folderId.startsWith('folder'))
        .map(([folderId, folderItems]) => (
          <Window id={folderId}>
            {folderItems.map((file) => {
              const active = selectedFiles.includes(file.id)
              return (
                <DroppableLocation id={`droppable-${file.id}`} locationId={file.id}>
                  <DraggableFile key={file.id} id={file.id} selected={active} file={file} fileCallback={fileCallback} />
                </DroppableLocation>
              )
            })}
          </Window>
        ))}
      <DragOverlay>
        {activeFile ? <FileIcon key={activeFile.id} selected={false} file={activeFile} getFileCallback={() => null} /> : null}
      </DragOverlay>
    </DndContext>
  )

  function getWindowIdAndFileIndex(id) {
    const windowIds = Object.keys(fileStore)
    if (windowIds.includes(id)) return [id, null]
    for (const windowId of windowIds) {
      const fileIndex = fileStore[windowId].findIndex((file) => file.id === id)
      if (fileIndex >= 0) {
        return [windowId, fileIndex]
      }
    }
    return [null, null]
  }

  // Beware of slow code.
  function handleDragOver(event) {
    document.getElementById(activeFile.id).style.opacity = '0'
    const { over, active } = event
    console.log(`active:`)
    console.log(active)
    console.log(`over:`)
    console.log(over)
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
    debugger
    const {
      data: {
        current: { locationId },
      },
    } = over

    // Don't do anything if file is dropped back at the same place
    if (id === locationId) return
    const [activeContainer, activeIndex] = getWindowIdAndFileIndex(id)
    const [overContainer, overIndex] = getWindowIdAndFileIndex(locationId)

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
