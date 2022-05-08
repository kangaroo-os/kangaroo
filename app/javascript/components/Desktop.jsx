import React, { useRef, useState, useEffect } from 'react'
import api from '../helpers/api'
import FileIcon from '../components/shared/FileIcon'
import DragAndDropUpload from './shared/DragAndDropUpload'
import ContextMenu from './shared/context_menus/ContextMenu'
import FileContextMenu from './shared/context_menus/FileContextMenu'
import { Window } from './shared/Window'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../hooks'
import { addFile, getAllFiles, getFileLink, deleteFile } from '../api/cloud_files'

const Desktop = () => {
  const [fileList, setFileList] = useState([])
  const [windowList, setWindowList] = useState()
  const [fileUploading, setFileUploading] = useState(false)
  const navigate = useNavigate()

  const user = useAppSelector((state) => state.user.value)

  useEffect(() => {
    getFiles(user)
  }, [])

  async function getFiles(user) {
    try {
      const res = await getAllFiles(user)
      setFileList(res.data.files)
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/login')
      }
    }
  }

  async function uploadFile(file) {
    let formData = new FormData()
    formData.append('file', file)
    setFileUploading(true)
    const res = await addFile(user, formData)
    setFileUploading(false)
    setFileList((prev) => [...prev, res.data.file])
  }

  async function downloadFile(id) {
    try {
      const result = await getFileLink(user, id)
      const { url } = result.data
      window.open(url)
    } catch (e) {
      console.error(e)
    }
  }

  async function deleteUserFile(id) {
    try {
      await deleteFile(user, id)
      setFileList(fileList.filter((file) => file.id !== id))
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
  function fileCallback(type, id) {
    switch (type) {
      case 'download':
        downloadFile(id)
        break
      case 'delete':
        deleteUserFile(id)
        break
      case 'openFolder':
        openFolder(id)
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
      return <FileIcon key={file.name} file={file} getFileCallback={fileCallback} />
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
    <>
      <DragAndDropUpload
        className="w-full h-full rounded-lg p-10 absolute"
        onClick={(event) => event.stopPropagation()}
        uploadCallback={uploadFile}
      />
      <div className="p-10">
        <div>
          {fileList && renderFileList(fileList)}
          {fileUploading && <div>Uploading...</div>}
        </div>
        <ContextMenu>
          <FileContextMenu user={user} path={`users/${user.id}/`} callback={(file) => setFileList(prev => [...prev, file])}/>
        </ContextMenu>
        <Window>{windowList && renderWindowList(windowList)}</Window>
      </div>
    </>
  )
}

export default Desktop
