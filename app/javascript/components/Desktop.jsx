import React, { useRef, useState, useEffect } from 'react'
import api from '../helpers/api'
import Cookies from 'js-cookie'
import FileIcon from '../components/shared/FileIcon'
import DragAndDropUpload from '../components/shared/DragAndDropUpload'
import ContextMenu from '../components/shared/ContextMenu'

const ContextMenuElements = () => (
  <>
    <li>Delete</li>
    <li>Copy</li>
    <li>Rename</li>
  </>
)

const Desktop = () => {
  const [initialMount, setInitialMount] = useState(true)
  const [fileList, setFileList] = useState()

  const token = Cookies.get('kangaroo_token')

  useEffect(() => {
    if (initialMount) {
      if (!token) {
        window.location.href = '/'
      } else {
        api.post('/authorized', { token: token }).then((res) => {
          if (!res.data.authorized) {
            window.location.href = '/'
            return null
          } else {
            getFiles()
          }
        })
      }
    }
    setInitialMount(false)
  }, [])

  function getFiles() {
    api.get('/files', { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
      setFileList(res.data.files)
    })
  }

  function uploadFile(file) {
    let formData = new FormData()
    formData.append('file', file)
    api
      .post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res)
      })
  }

  async function downloadFile(name) {
    try {
      const result = await api.get(`/get_object?key=${name}`, { headers: { Authorization: `Bearer ${token}` } })
      const { url } = result.data
      window.open(url)
    } catch (e) {
      console.error(e)
    }
  }

  async function deleteFile(name) {
    try {
      await api.get(`/delete_object?key=${name}`, { headers: { Authorization: `Bearer ${token}` } })
      setFileList(fileList.filter((file) => file !== name))
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
      default:
        break
    }
  }

  const renderFileList = (files) => {
    return files.map((file) => {
      return <FileIcon name={file} getFileCallback={fileCallback} />
    })
  }

  return (
    <div className="p-5">
      {fileList && renderFileList(fileList)}
      <DragAndDropUpload className="w-full h-[400px] rounded-lg p-10" uploadCallback={uploadFile} />
      <ContextMenu elements={ContextMenuElements()} />
    </div>
  )
}

export default Desktop
