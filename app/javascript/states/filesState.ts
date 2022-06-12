import { useEffect, useState } from 'react'
import { BehaviorSubject } from 'rxjs'

let subject = new BehaviorSubject({
  selectedFiles: [] as string[],
  editedFile: null,
})

export const useFiles = () => {
  const [files, setFiles] = useState(subject.value)

  useEffect(() => {
    const subscription = subject.subscribe((selectedFiles) => {
      setFiles(selectedFiles)
    })

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const unselectAll = () => {
    subject.next({ editedFile: null, selectedFiles: [] })
  }
  const addSelectedFile = (id: string) => {
    subject.next({ ...subject.value, selectedFiles: [...subject.value.selectedFiles, id] })
  }

  const removeSelectedFile = (id: string) => {
    subject.next({ ...subject.value, selectedFiles: subject.value.selectedFiles.filter((f) => f !== id) })
  }
  const setSelectedFiles = (ids: string[]) => {
    subject.next({ editedFile: null, selectedFiles: ids })
  }

  const setEditingFile = (id: string | null) => {
    subject.next({ ...subject.value, editedFile: id })
  }

  return { files, unselectAll, addSelectedFile, removeSelectedFile, setSelectedFiles, setEditingFile }
}
