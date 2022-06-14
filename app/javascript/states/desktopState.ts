import { getDefaultPath } from '@helpers/fileStorage'
import { useState, useEffect } from 'react'
import { BehaviorSubject } from 'rxjs'
import { File } from '../models/File'

export type DesktopState = {
  files: { [id: string]: File[] }
  fileMappings: { [id: string]: File }
  selectedFiles: string[]
  uploading: boolean
}

let subject = new BehaviorSubject<DesktopState>({
  files: {},
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
      files: {
        ...subject.value.files,
        [windowId]: [...(subject.value.files[windowId] || []), file],
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
    for (const folder in subject.value.files) {
      if (subject.value.files[folder].map((file) => file.id).includes(id)) {
        windowId = folder
      }
    }

    let deepCopyMapping = JSON.parse(JSON.stringify(subject.value.fileMappings))
    delete deepCopyMapping[id]

    subject.next({
      ...subject.value,
      files: {
        ...subject.value.files,
        [windowId]: subject.value.files[windowId].filter((file) => file.id !== id),
      },
      fileMappings: deepCopyMapping,
    })
  }

  function setWindowFiles(windowId: string, files: File[]) {
    subject.next({
      ...subject.value,
      files: {
        ...subject.value.files,
        [windowId]: files,
      },
      fileMappings: {
        ...subject.value.fileMappings,
        ...files.reduce((acc, file) => {
          acc[file.id] = file
          return acc
        }, {}),
      },
    })
  }

  function createWindow(windowId: string) {
    subject.next({
      ...subject.value,
      files: {
        ...subject.value.files,
        [windowId]: [],
      },
    })
  }

  function closeWindow(windowId: string) {
    if (windowId === getDefaultPath()) return
    const updatedSubject = {
      ...subject.value,
    }
    delete updatedSubject.files[windowId]
    subject.next(updatedSubject)
  }

  return {
    desktop,
    addFile,
    setUploading,
    removeFile,
    setWindowFiles,
    closeWindow,
    createWindow,
  }
}
