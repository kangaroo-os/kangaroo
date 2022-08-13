import React, { useState, useEffect, useRef } from 'react'
import DragAndDropUpload from './shared/DragAndDropUpload'
import ContextMenu from './shared/context_menus/ContextMenu'
import { useNavigate } from 'react-router-dom'
import { addCloudFile } from '@api/cloud_files'
import { getFileUrl } from '@api/abstract_files'
import { deleteFile, getAllFiles } from '@api/files'
import { getFolderFiles } from '@api/folder_files'
import UploadButton from './shared/UploadButton'
import { useDesktop } from '@states/desktopState'
import { getUser } from '@states/userState'
import GridView from '@components/shared/desktop/GridView'
import { useFiles } from '@states/filesState'
import { fromEvent } from 'rxjs'
import { setDefaultPath, getDesktopId } from '@helpers/fileStorage'
import DisappearingPopup from '@components/shared/DisappearingPopup'
import { useError } from '@states/errorState'

const Desktop = () => {
  const navigate = useNavigate()

  let user = getUser()
  const { desktop, addFile, setUploading, removeFile, setWindowFiles, createWindow } = useDesktop()
  const { unselectAll, files } = useFiles()
  const desktopRef = useRef(null)
  const [dropZoneDisabled, setDropZoneDisabled] = useState(true)
  const { error } = useError()

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
      const files = res.data.files
      const basePath = res.data.path
      setDefaultPath(basePath)
      setWindowFiles(getDesktopId(), files)
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
    addFile(getDesktopId(), res.data.file)
  }

  async function downloadFile(id) {
    try {
      const result = await getFileUrl(id)
      const { url } = result.data
      debugger
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

  async function openFolder(id) {
    try {
      const res = await getFolderFiles(id)
      const files = res.data.files
      createWindow(id)
      for (const file of files) {
        addFile(id, file)
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
        openFolder(file.id)
        break
      default:
        break
    }
  }

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
    >
      {!dropZoneDisabled && <DragAndDropUpload className="w-full h-full rounded-lg p-10 absolute cursor-default" uploadCallback={uploadFile} />}
      <div className="absolute m-5 right-[25px] top-[80px]">
        <UploadButton />
      </div>
      <div className="p-10 w-full h-full overflow-hidden">
        {desktop.windows && <GridView windows={desktop.windows} selectedFiles={files.selectedFiles} fileCallback={fileCallback} />}
      </div>
      {desktop.uploading && <div>Uploading...</div>}
      {/* Right click menu */}
      <ContextMenu />
      {error.message && <DisappearingPopup message={error.message} />}
    </div>
  )
}

export default Desktop
