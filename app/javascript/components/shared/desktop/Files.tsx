import React, { ReactElement } from 'react'
import DroppableLocation from './DroppableLocation'
import { useContextMenu } from '@states/contextMenuState'

export const Files = ({ id, children }): ReactElement => {
  const { setContextMenuLocation } = useContextMenu()

  return (
    <DroppableLocation id={id} locationId={id} fullSize={true}>
      <div
        onContextMenu={() => { setContextMenuLocation(id, true)} }
        className="flex flex-wrap flex-col content-start max-h-[90vh]"
      >
        {children}
      </div>
    </DroppableLocation>
  )
}

export default Files
