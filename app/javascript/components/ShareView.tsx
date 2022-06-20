import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '@helpers/api'
import FileIcon from './shared/FileIcon'

export const ShareView = () => {
  let { share_id } = useParams()
  let imgRef = useRef<HTMLImageElement>()
  const [files, setFiles] = useState([])
  useEffect(() => {
    if (share_id) {
      api.get(`/files/proxied_files/${share_id}`).then((res) => {
        if (res.data.files) {
          setFiles(res.data.files)
        } else if (res.data) {
          let binaryData = []
          binaryData.push(res.data)
          imgRef.current.src = window.URL.createObjectURL(new Blob(binaryData, { type: 'application/png' }))
        }
      })
    }
  }, [share_id])

  function renderFiles() {
    return files.map((file) => {
      return <FileIcon selected={false} key={file.id} file={file} getFileCallback={console.log} />
    })
  }

  function renderFilePreview() {
    return <img ref={imgRef} />
  }
  return (
    <div className="m-24">
      {files.length > 1 && <div className="shadow-lg w-full">{files.length > 0 && renderFiles()}</div>}
      {files.length <= 1 && renderFilePreview()}
    </div>
  )
}
export default ShareView
