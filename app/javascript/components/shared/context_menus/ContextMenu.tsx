import React, { useState, useRef } from 'react'
import { useEffect } from 'react'
import { fromEvent } from 'rxjs'
import { useContextMenu } from '@states/contextMenuState'
import FileContextMenu from './FileContextMenu'
import DefaultContextMenu from './DefaultContextMenu'

export const ContextMenu = () => {
  const { contextMenu, showContextMenu, hideContextMenu, getContextMenuLocation } = useContextMenu()
  const [locationId, isFolder] = getContextMenuLocation()

  let menuRef = useRef<HTMLDivElement>(null)

  function hideMenu() {
    hideContextMenu()
  }

  function rightClick(e) {
    e.preventDefault()

    const menu = menuRef.current
    showContextMenu(e.pageX, e.pageY)
    menu.style.left = e.pageX + 'px'
    menu.style.top = e.pageY + 'px'
  }

  useEffect(() => {
    const rightClickEvent = fromEvent(document, 'contextmenu').subscribe(rightClick)
    const hideMenuEvent = fromEvent(document, 'click').subscribe(hideMenu)
    return () => {
      rightClickEvent.unsubscribe()
      hideMenuEvent.unsubscribe()
    }
  })

  return (
    <div
      id="contextMenu"
      ref={menuRef}
      className={`context-menu absolute z-50 bg-gray-100 p-2 rounded ${
        contextMenu.hidden ? 'hidden' : `block left-[${contextMenu.x}px] top-[${contextMenu.y}px]`
      }`}
    >
      <ul className="space-y-2">
        { isFolder ? <DefaultContextMenu /> : <FileContextMenu /> }
      </ul>
    </div>
  )
}

export default ContextMenu
