import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '@helpers/api'
import FileIcon from './shared/FileIcon'
import { AxiosResponse } from 'axios'

export const ShareView = () => {
  let { share_id } = useParams()
  const [files, setFiles] = useState([])
  useEffect(() => {
    if (share_id) {
      api.get(`/files/proxied_files/${share_id}`).then((res: AxiosResponse) => {
        if (res.data.files) {
          setFiles(res.data.files)
        }
      })
    }
  }, [share_id])

  function renderFiles() {
    return files.map((file) => {
      return <FileIcon selected={false} key={file.id} file={file} getFileCallback={console.log} />
    })
  }

  return (
    <div className="m-24 ">
      {files.length > 0 && (
        <div className="border-gray-400 rounded-lg z-10 bg-gray-200 shadow-lg m-auto max-w-[800px] p-5">{files.length > 0 && renderFiles()}</div>
      )}
    </div>
  )
}
export default ShareView
