import { useState, useEffect } from 'react'
import { BehaviorSubject } from 'rxjs'
import { File } from '../models/File'

export type FileStorage = {
  [name: string]: File[]
}

export type DesktopState = {
  files: FileStorage
  selectedFiles: string[]
  uploading: boolean
}

let subject = new BehaviorSubject<DesktopState>({
  files: {},
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
    })
  }

  function setUploading(uploading: boolean) {
    subject.next({ ...subject.value, uploading: uploading })
  }

  function removeFile(id: string) {
    let windowId = null
    for (const folder in subject.value.files) {
      if (subject.value.files[folder].map(file => file.id).includes(id)) {
        windowId = folder
      }
    }
    if (!windowId) return
  }

  function setWindowFiles(windowId: string, files: File[]) {
    const newSub = {
      ...subject.value,
      files: {
        ...subject.value.files,
        [windowId]: files,
      },
    }
    subject.next(newSub)  
  }

  function createWindow(windowId: string) {
    subject.next({
      ...subject.value,
      files: {
        ...subject.value.files,
        [windowId]: []
      },
    })
  }

  function closeWindow(windowId: string) {
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
