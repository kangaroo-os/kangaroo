import { useEffect, useState } from 'react'
import { BehaviorSubject, fromEvent } from 'rxjs'

let subject = new BehaviorSubject([] as string[])

export const useSelectedFiles = () => {
  const [selectedFiles, setFiles] = useState(subject.value)

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
    subject.next([])
  }
  const addSelectedFile = (id: string) => {
    subject.next([...subject.value, id])
  }

  const removeSelectedFile = (id: string) => {
    subject.next(subject.value.filter((f) => f !== id))
  }
  const setSelectedFiles = (ids: string[]) => {
    subject.next(ids)
  }
  return { selectedFiles, unselectAll, addSelectedFile, removeSelectedFile, setSelectedFiles }
}
