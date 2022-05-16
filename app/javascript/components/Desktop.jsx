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
import { addFile as addFiletoState, removeFile as removeFileFromState, setUploading, setInitialFiles } from '../reducers/desktopSlice'
import { email_olivia } from '../api/mailer'

const Desktop = () => {
  const navigate = useNavigate()
  let dispatch = useAppDispatch()

  const [sentEmail, setSentEmail] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])

  let user = useAppSelector((state) => state.user.value)
  let desktop = useAppSelector((state) => state.desktop.value)

  useEffect(() => {
    getFiles()
  }, [])

  async function getFiles() {
    try {
      const res = await getAllFiles()
      dispatch(setInitialFiles(res.data.files))
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
      return <FileIcon key={file.name} selected={true} file={file} getFileCallback={fileCallback} />
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

  function sendOliviaEmail(e) {
    e.preventDefault()
    const complaint = e.target.complaint.value
    email_olivia(complaint)
    setSentEmail(true)
    e.target.complaint.value = ''
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
        {/* <Modal></Modal> */}
        {/* <Window>{windowList && renderWindowList(windowList)}</Window> */}
      </div>
    </>
  )
}

export default Desktop
