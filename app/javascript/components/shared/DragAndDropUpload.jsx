import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const DragAndDropUpload = ({ uploadCallback }) => {
  const onDrop = useCallback((acceptedFiles) => {
    for (let file of acceptedFiles) {
      uploadCallback(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? <div className="w-full h-10 border-blue-500">Drop the files here...</div> : <div className="w-full h-10 bg-blue-300">Drop your files here</div>}
    </div>
  );
};

export default DragAndDropUpload;
