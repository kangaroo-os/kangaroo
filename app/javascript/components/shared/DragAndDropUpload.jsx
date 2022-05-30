import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

const DragAndDropUpload = ({ uploadCallback, ...props }) => {
  const onDrop = useCallback((acceptedFiles) => {
    for (let file of acceptedFiles) {
      uploadCallback(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true, noKeyboard: true })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div {...{ ...props, className: `${props.className} bg-blue-100` }} />
      {isDragActive && <div>Dropping...</div>}
    </div>
  )
}

export default DragAndDropUpload
