import { getDesktopId } from '@helpers/fileStorage'
import { useState, useEffect } from 'react'
import { BehaviorSubject } from 'rxjs'

let subject = new BehaviorSubject({
  isFolder: true,
  locationId: null,
  hidden: true,
  resettable: false,
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
    subject.next({ resettable: true, isFolder: true, locationId: null, hidden: true, x: 0, y: 0 })
  }

  const showContextMenu = (x: number, y: number) => {
    subject.next({ ...subject.value, hidden: false, x: x, y: y, resettable: true })
  }

  const setContextMenuLocation = (locationId: string, isFolder: boolean) => {
    // If location was set earlier, then no longer update it.
    if (!subject.value.resettable) return
    subject.next({ ...subject.value, isFolder: isFolder, locationId: locationId, resettable: false })
  }

  const getContextMenuLocation = () => {
    return [subject.value.locationId || getDesktopId(), subject.value.isFolder]
  }

  return { contextMenu, hideContextMenu, showContextMenu, setContextMenuLocation, getContextMenuLocation }
}
