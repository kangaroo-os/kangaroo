import React, { ReactNode } from 'react'

export const ContextMenu = ({ elements }: { elements: ReactNode }) => {
  return (
    <div id="contextMenu" className="context-menu absolute" style={{ display: 'none' }}>
      <ul>{elements}</ul>
    </div>
  )
}

export default ContextMenu
