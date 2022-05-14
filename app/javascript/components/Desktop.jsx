import React, { useState, useEffect } from 'react'
import FileIcon from '../components/shared/FileIcon'
import DragAndDropUpload from './shared/DragAndDropUpload'
import ContextMenu from './shared/context_menus/ContextMenu'
import FileContextMenu from './shared/context_menus/FileContextMenu'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { addCloudFile, getCloudFileLink } from '../api/cloud_files'
import { deleteFile } from '../api/files'
import { getAllFiles } from '../api/files'
import UploadButton from './shared/UploadButton'
import { addFile as addFiletoState, removeFile as removeFileFromState, setUploading } from '../reducers/desktopSlice'

const Desktop = () => {
  const navigate = useNavigate()
  let dispatch = useAppDispatch()

  let user = useAppSelector((state) => state.user.value)
  let desktop = useAppSelector((state) => state.desktop.value)

  useEffect(() => {
    getFiles()
  }, [])

  async function getFiles() {
    try {
      const res = await getAllFiles()
      if (res.data.files.count != desktop.files.count) dispatch(addFiletoState(res.data.files))
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/login')
      }
    }
  }

  async function uploadFile(blob) {
    dispatch(setUploading(true))
    const res = await addCloudFile(blob)
    dispatch(setUploading(false))
    dispatch(addFiletoState(res.data.file))
  }

  async function downloadFile(id) {
    try {
      const result = await getCloudFileLink(id)
      const { url } = result.data
      window.open(url)
    } catch (e) {
      console.error(e)
    }
  }

  async function deleteUserFile(id) {
    try {
      await deleteFile(id)
      dispatch(removeFileFromState(id))
      // setFileList(fileList.filter((file) => file.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  async function openFolder(name) {
    // try {
    //   await api.get(`/get_folder_files?key=${name}`)
    //   setWindowList(fileList.filter((file) => file !== name))
    // } catch (e) {
    //   console.error(e)
    // }
    console.log(name)
  }

  function fileCallback(type, file) {
    switch (type) {
      case 'download':
        downloadFile(file.id)
        break
      case 'delete':
        deleteUserFile(file.id)
        break
      case 'openFolder':
        openFolder(file.id)
        break
      case 'link':
        window.open(file.path)
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
        className="w-full h-full rounded-lg p-10 absolute cursor-default"
        uploadCallback={uploadFile}
      />
      <div className="p-10 flex flex-row-reverse">
        <UploadButton />
        <div>
          {desktop.files && renderFileList(desktop.files)}
          {desktop.uploading && <div>Uploading...</div>}
        </div>
        <ContextMenu>
          <FileContextMenu path={`users/${user.id}/`} callback={(file) => dispatch(addFiletoState(file))} />
        </ContextMenu>
        {/* <Modal></Modal> */}
        {/* <Window>{windowList && renderWindowList(windowList)}</Window> */}
      </div>
    </>
  )
}

export default Desktop
