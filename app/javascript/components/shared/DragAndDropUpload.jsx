import React, { useState } from "react";

const DragAndDropUpload = ({ uploadCallback }) => {
  const [dragOver, setDragOver] = useState(false);

  function onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadCallback(e.dataTransfer.files[0]);
    }
    uploadCallback();
    console.log("DROPPED");
  }

  function onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!dragOver) {
      setDragOver(true);
    }
    console.log("DRAGGED OVER");
  }

  function onDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    if (dragOver) {
      setDragOver(false);
    }
    console.log("DRAGGED LEAVE");
  }
  return (
    <div className={`${!dragOver ? "" : "bg-blue-100"} h-48 border-2 border-dashed rounded-lg p-5`} onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>
      <p className="text-center">Drag and drop files here</p>
    </div>
  );
};

export default DragAndDropUpload;
