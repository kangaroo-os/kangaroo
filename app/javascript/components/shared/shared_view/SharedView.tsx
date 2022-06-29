import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import SharedFileIcon from './SharedFileIcon'
import SharedWindow from './SharedWindow'
import { getSharedFiles, getSharedFile } from '@api/abstract_files'

export const SharedView = () => {
  let { share_id } = useParams()
  const [files, setFiles] = useState([])
  const [rootFile, setRootFile] = useState(null)
  useEffect(() => {
    if (share_id) {
      getSharedFiles(share_id).then((res) => {
        setFiles(res.data.files)
        setRootFile(res.data.root_file)
      })
    }
  }, [share_id])

  function getViewableFileLink(id) {
    return files.find((file) => file.id === id).public_share_url
  }

  async function openFolder(id) {
    try {
      const share_id = getViewableFileLink(id)
      window.location.href = `/share/${share_id}`
    } catch (e) {
      console.error(e)
    }
  }

  async function downloadFile(id) {
    try {
      const share_id = getViewableFileLink(id)
      const result = await getSharedFile(share_id)
      const { url } = result.data
      window.open(url)
    } catch (e) {
      console.error(e)
    }
  }

  function fileCallback(type, file) {
    switch (type) {
      case 'download':
        downloadFile(file.id)
        break
      case 'openFolder':
        openFolder(file.id)
        break
      default:
        break
    }
  }

  return (
    <div className="m-24">
      <div className="shadow-lg w-full">
        <SharedWindow rootFile={rootFile}>
          {files.length > 0 ? (
            <>
              {files.map((file) => {
                return <SharedFileIcon key={file.id} file={file} getFileCallback={fileCallback} />
              })}
            </>
          ) : (
            <p> No files here ;p </p>
          )}
        </SharedWindow>
      </div>
    </div>
  )
}
export default SharedView
