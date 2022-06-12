import React from "react";
import { useDroppable } from "@dnd-kit/core";

const DroppableLocation = ({ id, locationId, children, fullSize = false }) => {
  const {setNodeRef} = useDroppable({
    id: id,
    data: {
      locationId: locationId,
    }
  });

  const style = {
    width: fullSize ? '100%' : 'max-content',
    height: fullSize ? '100%' : 'max-content',
  }

  return (
    <div id={id} ref={setNodeRef} style={style}>
      {children}
    </div>
  )
}

export default DroppableLocation