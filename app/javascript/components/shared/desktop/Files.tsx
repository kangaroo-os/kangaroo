import React, { ReactElement } from 'react'
import { File } from '@models/File'
import { SortableFile } from './SortableFile'

export const Files = ({ files, selectedFiles, fileCallback }: { files: File[]; selectedFiles: string[]; fileCallback: () => {} }): ReactElement => {
  return (
    <div className="flex flex-wrap">
      {files.map((file) => {
        const active = selectedFiles.includes(file.id)
        return <SortableFile key={file.id} selected={active} file={file} fileCallback={fileCallback} />
      })}
    </div>
  )
}

export default Files
