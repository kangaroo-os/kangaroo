import React, { useRef, useState, useEffect } from 'react'
import api from '../helpers/api'
import FileIcon from '../components/shared/FileIcon'
import DragAndDropUpload from './shared/DragAndDropUpload'
import ContextMenu from './shared/context_menus/ContextMenu'
import FileList from './shared/context_menus/FileList'
import { Window } from './shared/Window'

const Desktop = () => {
  const [fileList, setFileList] = useState()
  const [windowList, setWindowList] = useState()
  const [fileUploading, setFileUploading] = useState(false)

  useEffect(() => {
    getFiles()
  }, [])

  function getFiles() {
    api.get(`/files`).then((res) => {
      setFileList(res.data.files)
    })
  }

  function uploadFile(file) {
    let formData = new FormData()
    formData.append('file', file)
    setFileUploading(true)
    api
      .post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => {
        console.log(res)
        setFileUploading(false)
      })
  }

  async function downloadFile(name) {
    try {
      const result = await api.get(`/get_object?key=${name}`)
      const { url } = result.data
      window.open(url)
    } catch (e) {
      console.error(e)
    }
  }

  async function deleteFile(name) {
    try {
      await api.get(`/delete_object?key=${name}`)
      setFileList(fileList.filter((file) => file !== name))
    } catch (e) {
      console.error(e)
    }
  }

  async function openFolder(name) {
    try {
      await api.get(`/get_folder_files?key=${name}`)
      setWindowList(fileList.filter((file) => file !== name))
    } catch (e) {
      console.error(e)
    }
  }
  function fileCallback(type, name) {
    switch (type) {
      case 'download':
        downloadFile(name)
        break
      case 'delete':
        deleteFile(name)
        break
      case 'openFolder':
        openFolder(name)
        break
      default:
        break
    }
  }

  const renderFileList = (files) => {
    if (files.length === 0) {
      return <div>No files found</div>
    }
    return files.map((file) => {
      return <FileIcon key={file} name={file} getFileCallback={fileCallback} />
    })
  }

  const renderWindowList = (files) => {
    if (files.length === 0) {
      return <div>No files found</div>
    }
    return files.map((file) => {
      return <FileIcon key={file} name={file} getFileCallback={fileCallback} />
    })
  }

  return (
    <div className="p-5">
      {fileList && renderFileList(fileList)}
      {fileUploading && <div>Uploading...</div>}
      <DragAndDropUpload className="w-full h-[400px] rounded-lg p-10" uploadCallback={uploadFile} />
      <ContextMenu>
        <FileList />
      </ContextMenu>
      <Window>{windowList && renderWindowList(windowList)}</Window>
    </div>
  )
}

export default Desktop
