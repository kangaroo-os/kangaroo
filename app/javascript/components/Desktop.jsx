import React, { useState, useEffect, useRef } from 'react'
import DragAndDropUpload from './shared/DragAndDropUpload'
import ContextMenu from './shared/context_menus/ContextMenu'
import FileContextMenu from './shared/context_menus/FileContextMenu'
import { useNavigate } from 'react-router-dom'
import { addCloudFile } from '@api/cloud_files'
import { getFileUrl } from '@api/abstract_files'
import { deleteFile, getAllFiles, getFolderFiles } from '@api/files'
import UploadButton from './shared/UploadButton'
import { useDesktop } from '@states/desktopState'
import { getUser } from '@states/userState'
import GridView from '@components/shared/desktop/GridView'
import { useFiles } from '@states/filesState'
import { fromEvent } from 'rxjs'

const Desktop = () => {
  const navigate = useNavigate()

  let user = getUser()
  const { desktop, addFile, setUploading, removeFile, setWindowFiles, createWindow } = useDesktop()
  const { unselectAll, files } = useFiles()
  const desktopRef = useRef(null)
  const [dropZoneDisabled, setDropZoneDisabled] = useState(true)

  useEffect(() => {
    const desktop = fromEvent(desktopRef.current, 'click').subscribe(unselectAll)
    return () => desktop.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
    getFiles()
  }, [])

  async function getFiles() {
    try {
      const res = await getAllFiles()
      setWindowFiles('desktop', res.data.files)
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/login')
      }
    }
  }

  async function uploadFile(blob) {
    setDropZoneDisabled(true)
    setUploading(true)
    const res = await addCloudFile(blob)
    setUploading(false)
    addFile(res.data.file)
  }

  async function downloadFile(id) {
    try {
      const result = await getFileUrl(id)
      const { url } = result.data
      window.open(url)
    } catch (e) {
      console.error(e)
    }
  }

  async function deleteUserFile(id) {
    try {
      removeFile(id)
      await deleteFile(id)
    } catch (e) {
      console.error(e)
    }
  }

  async function openFolder(file_path) {
    try {
      const res = await getFolderFiles(file_path)
      const files = res.data.files.filter((file) => file.path !== file_path)
      createWindow(`folder-${file_path}`)
      for (const file of files) {
        addFile(`folder-${file_path}`, file)
      }
    } catch (e) {
      console.error(e)
    }
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
        openFolder(file.path)
        break
      default:
        break
    }
  }
  // const renderWindowList = (files) => {
  //   if (files.length === 0) {
  //     return <div>No files found</div>
  //   }
  //   return files.map((file) => {
  //     const active = selectedFiles.includes(file.id)
  //     return <SortableFile key={file.id} selected={active} file={file} fileCallback={fileCallback} />
  //   })
  // }

  // function sendOliviaEmail(e) {
  //   e.preventDefault()
  //   const complaint = e.target.complaint.value
  //   email_olivia(complaint)
  //   setSentEmail(true)
  //   e.target.complaint.value = ''
  // }

  // <-- Drag zone detection begins -->
  const onDragOver = (event) => {
    if (dropZoneDisabled && targetIsTopLevel(event)) {
      if (validDragItems(event) && !isDragInProgress(event)) {
        event.currentTarget.setAttribute('drag-in-progress', 'true')
        setDropZoneDisabled(false)
      }
    }
  }

  const onDragLeave = (event) => {
    if (!dropZoneDisabled && targetIsTopLevel(event) && isDragInProgress(event)) {
      event.currentTarget.setAttribute('drag-in-progress', 'false')
      setDropZoneDisabled(true)
    }
  }

  const isDragInProgress = (event) => {
    event.currentTarget.getAttribute('drag-in-progress') === 'true'
  }

  const validDragItems = (event) => {
    if (event.dataTransfer.types) {
      for (let i = 0; i < event.dataTransfer.types.length; i++) {
        if (event.dataTransfer.types[i] === 'Files') {
          return true
        }
      }
    }
    return false
  }

  const targetIsTopLevel = (event) => {
    return event.currentTarget.id === 'desktop'
  }

  // <-- Drag zone detection ends -->

  return (
    <div
      id="desktop"
      className="h-[100vh] pt-10"
      ref={desktopRef}
      onDragOverCapture={onDragOver}
      onDragLeaveCapture={onDragLeave}
      style={{ backgroundImage: `url("https://kangarooo.s3.amazonaws.com/kangaroo/background.png")` }}
    >
      {!dropZoneDisabled && <DragAndDropUpload className="w-full h-full rounded-lg p-10 absolute cursor-default" uploadCallback={uploadFile} />}
      <div className="absolute m-5 right-[25px] top-[80px]">
        <UploadButton />
      </div>
      <div className="p-10 w-full h-full overflow-hidden">
        <div>
          {desktop.files && <GridView fileStore={desktop.files} selectedFiles={files.selectedFiles} fileCallback={fileCallback} />}
          {desktop.uploading && <div>Uploading...</div>}
        </div>

        {/* Right click menu */}
        <ContextMenu>
          <FileContextMenu path={`users/${user?.id}/`} />
        </ContextMenu>
      </div>
    </div>
  )
}

export default Desktop
