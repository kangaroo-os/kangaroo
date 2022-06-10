import React from "react";
import { useDroppable } from "@dnd-kit/core";

const DroppableLocation = ({ id, locationId, children }) => {
  const {setNodeRef} = useDroppable({
    id: id,
    data: {
      locationId: locationId,
    }
  });

  return (
    <div id={id} ref={setNodeRef}>
      {children}
    </div>
  )
}

export default DroppableLocation