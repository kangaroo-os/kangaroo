import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const DragAndDropUpload = ({ uploadCallback, ...props }) => {
  const onDrop = useCallback((acceptedFiles) => {
    for (let file of acceptedFiles) {
      uploadCallback(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <div {...{ ...props, className: `${props.className} bg-blue-100` }} />
      ) : (
        <div {...{ ...props, className: `${props.className}` }} />
      )}
    </div>
  )
}

export default DragAndDropUpload
