import React, { ReactNode } from 'react'

export const ContextMenu = ({ elements }: { elements: ReactNode }) => {
  document.onclick = hideMenu
  document.oncontextmenu = rightClick

  function hideMenu() {
    document.getElementById('contextMenu').style.display = 'none'
  }

  function rightClick(e) {
    e.preventDefault()

    if (document.getElementById('contextMenu').style.display == 'block') hideMenu()
    else {
      var menu = document.getElementById('contextMenu')

      menu.style.display = 'block'
      menu.style.left = e.pageX + 'px'
      menu.style.top = e.pageY + 'px'
    }
  }

  return (
    <div id="contextMenu" className="context-menu absolute" style={{ display: 'none' }}>
      <ul>{elements}</ul>
    </div>
  )
}

export default ContextMenu
