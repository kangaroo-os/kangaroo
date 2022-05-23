import { useState, useEffect } from 'react'
import { BehaviorSubject } from 'rxjs'

let subject = new BehaviorSubject({
  hidden: true,
  x: 0,
  y: 0,
})

export const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState(subject.value)

  useEffect(() => {
    const subscription = subject.subscribe((contextMenu) => {
      setContextMenu(contextMenu)
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const hideContextMenu = () => {
    subject.next({ ...subject.value, hidden: true })
  }

  const showContextMenu = (x: number, y: number) => {
    subject.next({ hidden: false, x: x, y: y })
  }

  return { contextMenu, hideContextMenu, showContextMenu }
}
