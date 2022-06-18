import { getDefaultPath } from '@helpers/fileStorage'
import { useState, useEffect } from 'react'
import { BehaviorSubject } from 'rxjs'
import { File } from '../models/File'
import { WindowContent, FileMappings } from '../models/Desktop'

export type DesktopState = {
  windows: WindowContent
  fileMappings: FileMappings
  selectedFiles: string[]
  uploading: boolean
}

let subject = new BehaviorSubject<DesktopState>({
  windows: {},
  fileMappings: {},
  selectedFiles: [],
  uploading: false,
})

export const getDesktop = () => {
  if (!subject) {
    return undefined
  }
  return subject.value
}

// Be careful when creating a function that returns desktop data
// because component that takes in desktop wouldn't rerender unless
// "desktop" changes in the first place.
export const useDesktop = () => {
  const [desktop, setDesktop] = useState(subject.value)

  useEffect(() => {
    const subscription = subject.subscribe((desktop) => {
      setDesktop(desktop)
    })

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  function addFile(windowId: string, file: File) {
    subject.next({
      ...subject.value,
      windows: {
        ...subject.value.windows,
        [windowId]: [...(subject.value.windows[windowId] || []), file.id],
      },
      fileMappings: {
        ...subject.value.fileMappings,
        [file.id]: file,
      },
    })
  }

  function setUploading(uploading: boolean) {
    subject.next({ ...subject.value, uploading: uploading })
  }

  function removeFile(id: string) {
    let windowId = null
    for (const window in subject.value.windows) {
      if (subject.value.windows[window].includes(id)) {
        windowId = window
      }
    }

    let deepCopyMapping = JSON.parse(JSON.stringify(subject.value.fileMappings))
    delete deepCopyMapping[id]

    subject.next({
      ...subject.value,
      windows: {
        ...subject.value.windows,
        [windowId]: subject.value.windows[windowId].filter((fileId) => fileId !== id),
      },
      fileMappings: deepCopyMapping,
    })
  }

  function setWindowFiles(windowId: string, files: File[]) {
    const map = new Map(files.map(file => [file.id, file]))
    const updatedWindows = {
      ...subject.value.windows,
      [windowId]: files.map((file) => file.id),
    }
    subject.next({
      ...subject.value,
      windows: updatedWindows,
      fileMappings: {
        ...(Object.values(updatedWindows).flat()).reduce((acc, id) => {
          acc[id] = subject.value.fileMappings[id] || map.get(id)
          return acc
        }, {}),
      },
    })
  }

  function createWindow(windowId: string) {
    subject.next({
      ...subject.value,
      windows: {
        ...subject.value.windows,
        [windowId]: [],
      },
    })
  }

  function closeWindow(windowId: string) {
    if (windowId === getDefaultPath()) return
    const updatedSubject = {
      ...subject.value,
    }
    delete updatedSubject.windows[windowId]
    subject.next(updatedSubject)
  }

  function updateExistingFile(file: File) {
    subject.next({
      ...subject.value,
      fileMappings: {
        ...subject.value.fileMappings,
        [file.id]: file,
      },
    })
  }

  function getFileFromId(id: string) {
    return subject.value.fileMappings[id]
  }

  return {
    desktop,
    addFile,
    setUploading,
    removeFile,
    updateExistingFile,
    setWindowFiles,
    closeWindow,
    createWindow,
    getFileFromId,
  }
}
