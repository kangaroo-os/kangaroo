import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '@helpers/api'
import FileIcon from './shared/FileIcon'
import SharedWindow from './SharedWindow'

export const ShareView = () => {
  let { share_id } = useParams()
  const [files, setFiles] = useState([])
  useEffect(() => {
    if (share_id) {
      api.get(`/files/proxied_files/${share_id}`).then((res) => {
        setFiles(res.data.files)
      })
    }
  }, [share_id])

  function renderFiles() {
    return (
      <SharedWindow windowId={share_id}>
        {files.map((file) => {
          return <FileIcon selected={false} key={file.id} file={file} getFileCallback={console.log} />
        })}
      </SharedWindow>
    )
  }
  return (
    <div className="m-24">
      <div className="shadow-lg w-full">{files.length > 0 && renderFiles()}</div>
    </div>
  )
}
export default ShareView
