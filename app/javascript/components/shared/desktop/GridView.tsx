import React from 'react'
import FileIcon from '@components/shared/FileIcon'
import { File } from '@models/File'
import { ReactNode } from 'react'

export const GridView = ({ files, selectedFiles, fileCallback }: { files: File[]; selectedFiles: string[]; fileCallback: () => {} }): ReactNode => {
  return (
    <div className="flex flex-wrap">
      {files.map((file) => {
        const active = selectedFiles.includes(file.id)
        return <FileIcon key={file.id} selected={active} file={file} getFileCallback={fileCallback} />
      })}
    </div>
  )
}

export default GridView
