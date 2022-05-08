import React, { ReactNode } from 'react'

export const ContextMenu = ({ children }) => {
  document.onclick = hideMenu
  document.oncontextmenu = rightClick

  function hideMenu() {
    const menu = document.getElementById('contextMenu')
    if (menu) {
      menu.style.display = 'none'
    }
  }

  function rightClick(e) {
    e.preventDefault()

    var menu = document.getElementById('contextMenu')

    menu.style.display = 'block'
    menu.style.left = e.pageX + 'px'
    menu.style.top = e.pageY + 'px'
  }

  return (
    <div id="contextMenu" className="context-menu absolute z-50 bg-gray-100 p-2 rounded" style={{ display: 'none' }}>
      <ul className="space-y-2">{children}</ul>
    </div>
  )
}

export default ContextMenu
