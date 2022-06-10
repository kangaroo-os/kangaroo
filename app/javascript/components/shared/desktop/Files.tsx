import React, { ReactElement } from 'react'
import DroppableLocation from './DroppableLocation';

export const Files = ({ id, children }): ReactElement => {

  return (
    <DroppableLocation id={'desktop'} locationId={'desktop'}>
      <div className="flex flex-wrap flex-col content-start max-h-[90vh]">
        {children}
        </div>
    </DroppableLocation>
  )
}

export default Files
