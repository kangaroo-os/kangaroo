import { useState, useEffect } from 'react'
import { BehaviorSubject } from 'rxjs'

let subject = new BehaviorSubject({
  isFolder: false,
  locationId: null,
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
    subject.next({ isFolder: false, locationId: null, hidden: true, x: 0, y: 0 })
  }

  const showContextMenu = (x: number, y: number) => {
    subject.next({ ...subject.value, hidden: false, x: x, y: y })
  }

  const setContextMenuLocation = (locationId: string, isFolder: boolean) => {
    // If location was set earlier, then no longer update it.
    // Checking hidden to prevent bug where context menu is shown before switching to another target
    if (subject.value.locationId && subject.value.hidden) return
    subject.next({ ...subject.value, isFolder: isFolder, locationId: locationId })
  }

  const getContextMenuLocation = () => {
    return [subject.value.locationId, subject.value.isFolder]
  }

  return { contextMenu, hideContextMenu, showContextMenu, setContextMenuLocation, getContextMenuLocation }
}
