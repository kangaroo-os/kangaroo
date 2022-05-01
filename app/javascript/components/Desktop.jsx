import React, { useRef, useState, useEffect } from 'react'
import api from '../helpers/api'
import FileIcon from '../components/shared/FileIcon'
import DragAndDropUpload from './shared/DragAndDropUpload'
import ContextMenu from './shared/context_menus/ContextMenu'
import FileList from './shared/context_menus/FileList'
import { useSelector } from 'react-redux'

const Desktop = () => {
  const [fileList, setFileList] = useState()
  const user = useSelector((state) => state.user.value)

  useEffect(() => {
    console.log(user)
    if (user.email) {
      getFiles()
    } else {
      // window.location.href = '/'
    }
  }, [])

  function getFiles() {
    api.get(`/files`).then((res) => {
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
      return <FileIcon key={file} name={file} getFileCallback={fileCallback} />
    })
  }

  return (
    <div className="p-5">
      {fileList && renderFileList(fileList)}
      <DragAndDropUpload className="w-full h-[400px] rounded-lg p-10" uploadCallback={uploadFile} />
      <ContextMenu>
        <FileList />
      </ContextMenu>
    </div>
  )
}

export default Desktop
