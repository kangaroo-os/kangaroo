import React from 'react'
import { File } from '@models/File'
import { ReactNode } from 'react'
import { getFileTypeIcon } from '@helpers/cloud_file'

export const TableView = ({ files, selectedFiles, fileCallback }: { files: File[]; selectedFiles: string[]; fileCallback: () => {} }): ReactNode => {
  function renderFiles() {
    return files.map((file) => {
      const active = selectedFiles.includes(file.id)
      return (
        <tr key={file.id} className="hover:bg-blue-100">
          <td className="border border-slate-600 p-3">
            <i className={`mr-3 fa-solid fa-${getFileTypeIcon(file)} `}></i>
            {file.name}
          </td>
          <td className="border border-slate-600 p-3">{file.file_type}</td>
        </tr>
      )
    })
  }
  return (
    <table className="table-auto border-collapse">
      <thead>
        <tr>
          <th className="border border-slate-600">Name</th>
          <th className="border border-slate-600">Type</th>
        </tr>
      </thead>
      <tbody>{renderFiles()}</tbody>
    </table>
  )
}
export default TableView
