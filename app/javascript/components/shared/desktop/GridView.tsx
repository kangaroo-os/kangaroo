import React, { ReactElement, useState } from 'react'
import { DndContext, pointerWithin, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { File } from '@models/File'
import Files from './Files'
import Window from './../Window'
import DraggableFile from './DraggableFile'
import FileIcon from '../FileIcon'
import { useDesktop } from '../../../states/desktopState'
import { getDesktopId, getDesktopFiles, getFolders } from '@helpers/fileStorage'
import DroppableLocation from './DroppableLocation'
import { moveFile } from '@api/files'
import { WindowContent } from '@models/Desktop'

function GridView({
  windows,
  selectedFiles,
  fileCallback,
}: {
  windows: WindowContent
  selectedFiles: string[]
  fileCallback: () => {}
}): ReactElement {
  const { setWindowFiles, removeFile, closeWindow, getFileFromId } = useDesktop()
  const [activeFile, setActiveFile] = useState<File>()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  )

  return (
    <div className="w-full h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
      >
        <Files id={getDesktopId()}>
          {getDesktopFiles(windows)?.map((fileId) => {
            const active = selectedFiles.includes(fileId)
            return (
              <DroppableLocation key={`desktopDroppable-${fileId}`} id={`desktopDroppable-${fileId}`} locationId={fileId}>
                <DraggableFile id={fileId} selected={active} file={getFileFromId(fileId)} fileCallback={fileCallback} />
              </DroppableLocation>
            )
          })}
        </Files>
        {Object.entries(getFolders(windows)).map(([windowId, fileIds]) => (
          <Window windowId={windowId} key={windowId}>
            {fileIds.map((fileId: string) => {
              const active = selectedFiles.includes(fileId)
              return (
                <DroppableLocation key={`windowDroppable-${fileId}`} id={`windowDroppable-${fileId}`} locationId={fileId}>
                  <DraggableFile id={fileId} selected={active} file={getFileFromId(fileId)} fileCallback={fileCallback} />
                </DroppableLocation>
              )
            })}
          </Window>
        ))}
        <DragOverlay>
          {activeFile ? <FileIcon key={activeFile.id} selected={false} file={activeFile} getFileCallback={() => null} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  )

  function getWindowIdAndFileIdIndex(id: string): [string, number] {
    const windowIds = Object.keys(windows)
    if (windowIds.includes(id)) return [id, null]
    for (const windowId of windowIds) {
      const fileIndex = windows[windowId].findIndex((fileId) => fileId === id)
      if (fileIndex >= 0) {
        return [windowId, fileIndex]
      }
    }
    return [null, null]
  }

  function handleDragOver(event) {
    document.getElementById(activeFile.id).style.opacity = '0'
    // const { over, active } = event
    // console.log(`active:`)
    // console.log(active)
    // console.log(`over:`)
    // console.log(over)
  }

  function handleDragStart(event) {
    const { active } = event
    setActiveFile(getFileFromId(active.id))
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

    // Don't do anything if file is dropped back at the same place (loosely based on id)
    if (id == locationId) return
    const [activeContainer, activeIndex] = getWindowIdAndFileIdIndex(id)
    const [overContainer, overIndex] = getWindowIdAndFileIdIndex(locationId)

    if (!activeContainer || !overContainer) return

    // Don't allow dragging folder into its own window
    if (getFileFromId(overContainer)?.path === activeFile.path) return

    // Check if user dragged item inside another existing file
    if (overIndex !== null) {
      const overFileId = windows[overContainer][overIndex]
      // User drags item inside a folder icon, put it inside the folder
      if (getFileFromId(overFileId).file_type === 'folder') {
        removeFile(activeFile.id)
        moveFile(activeFile.id, overFileId)
        if (windows[activeContainer].length === 0) {
          closeWindow(activeContainer)
        }
        setActiveFile(null)
        return
      }
    }

    // If user rearranges files within same container, then change the order
    // Else move the file into the window
    if (activeContainer === overContainer) {
      // TODO BACKEND: Change the order
      // setWindowFiles(activeContainer, arrayMove(windows[activeContainer], activeIndex, overIndex))
    } else {
      moveFile(activeFile.id, overContainer)
      windows[activeContainer].splice(activeIndex, 1)
      windows[overContainer].splice(overIndex, 0, activeFile.id)
      setWindowFiles(activeContainer, windows[activeContainer].map(fileId => getFileFromId(fileId)))
      setWindowFiles(overContainer, windows[overContainer].map(fileId => getFileFromId(fileId)))
    }

    setActiveFile(null)
  }
}

export default GridView
