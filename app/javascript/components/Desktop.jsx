import React, { useState, useEffect, useRef } from 'react'
import FileIcon from '../components/shared/FileIcon'
import DragAndDropUpload from './shared/DragAndDropUpload'
import ContextMenu from './shared/context_menus/ContextMenu'
import FileContextMenu from './shared/context_menus/FileContextMenu'
import { useNavigate } from 'react-router-dom'
import { addCloudFile, getCloudFileLink } from '../api/cloud_files'
import { deleteFile, getAllFiles, getFolderFiles } from '@api/files'
import UploadButton from './shared/UploadButton'
import { email_olivia } from '../api/mailer'
import { useDesktop } from '@states/desktopState'
import { getUser } from '@states/userState'
import TableView from '@components/shared/desktop/TableView'
import GridView from '@components/shared/desktop/GridView'
import { useFiles } from '@states/filesState'
import { fromEvent } from 'rxjs'

const Desktop = () => {
  const navigate = useNavigate()

  const [sentEmail, setSentEmail] = useState(false)

  let user = getUser()
  const { desktop, addFile, setUploading, removeFile, setInitialFiles } = useDesktop()
  const { unselectAll, files } = useFiles()
  const desktopRef = useRef(null)

  useEffect(() => {
    const desktop = fromEvent(desktopRef.current, 'click').subscribe(unselectAll)
    return () => desktop.unsubscribe()
  }, [])

  useEffect(() => {
    getFiles()
  }, [])

  async function getFiles() {
    try {
      const res = await getAllFiles()
      setInitialFiles(res.data.files)
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/login')
      }
    }
  }

  async function uploadFile(blob) {
    setUploading(true)
    const res = await addCloudFile(blob)
    setUploading(false)
    addFile(res.data.file)
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
      removeFile(id)
    } catch (e) {
      console.error(e)
    }
  }

  async function openFolder(file_path) {
    try {
      await getFolderFiles(file_path)
      // setWindowList(fileList.filte((file) => file.path !== file_path))
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
      case 'link':
        window.open(file.path)
      default:
        break
    }
  }
  const renderWindowList = (files) => {
    if (files.length === 0) {
      return <div>No files found</div>
    }
    return files.map((file) => {
      return <FileIcon key={file} name={file} getFileCallback={fileCallback} />
    })
  }

  function sendOliviaEmail(e) {
    e.preventDefault()
    const complaint = e.target.complaint.value
    email_olivia(complaint)
    setSentEmail(true)
    e.target.complaint.value = ''
  }

  return (
    <div className="h-[90vh] relative" ref={desktopRef}>
      <DragAndDropUpload className="w-full h-full rounded-lg p-10 absolute cursor-default" uploadCallback={uploadFile} />
      <div className="absolute right-0 m-5">
        <UploadButton />
      </div>
      <div className="p-10">
        <div>
          {desktop.files && (
            // <TableView files={desktop.files} selectedFiles={files.selectedFiles} setSelectedFiles={setSelectedFiles} />
            <GridView files={desktop.files} selectedFiles={files.selectedFiles} fileCallback={fileCallback} />
          )}
          {desktop.uploading && <div>Uploading...</div>}
        </div>
        <ContextMenu>
          <FileContextMenu path={`users/${user.id}/`} callback={(file) => addFile(file)} />
        </ContextMenu>
        {/* temporarily complain to olivia text area */}
        <div className="absolute bottom-0 left-0 bg-blue-100 h-[20rem] w-[30rem] rounded border m-5 p-5 space-y-3">
          <h1>Want to complain directly to Olivia? Put in your thoughts here</h1>
          <form className="space-y-3" onSubmit={(e) => sendOliviaEmail(e)}>
            <textarea rows={5} className="k-input" name="complaint" id="complaint" />
            <button type="submit" className="p-3 bg-gray-100 rounded">
              Submit
            </button>
            {sentEmail && <p>Email sent!</p>}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Desktop
