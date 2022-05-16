import { useState, useEffect, SetStateAction } from 'react'
import { BehaviorSubject } from 'rxjs'
import { File } from '../models/File'

let subject = new BehaviorSubject({ files: [], selectedFiles: [], uploading: false })

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

  function AddSelectedFile(file: File) {
    subject.next({ ...subject.value, selectedFiles: [...subject.value.selectedFiles, file] })
  }

  function addFile(file: File) {
    subject.next({ ...subject.value, files: [...subject.value.files, file] })
  }

  function setUploading(uploading: boolean) {
    subject.next({ ...subject.value, uploading: uploading })
  }

  function removeFile(id: string) {
    subject.next({ ...subject.value, files: subject.value.files.filter((file: File) => file.id !== id) })
  }

  function setInitialFiles(files: File[]) {
    subject.next({ ...subject.value, files: files })
  }

  return { desktop, AddSelectedFile, addFile, setUploading, removeFile, setInitialFiles }
}
