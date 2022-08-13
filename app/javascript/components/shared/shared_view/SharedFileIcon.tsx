import React from 'react'
import { getFileTypeIcon } from '../../../helpers/cloud_file'
import { truncateText } from '../../../helpers/utils'
import { File } from '../../../models/File'

export const SharedFileIcon = ({
  file,
  getFileCallback,
}: {
  id?: string
  file: File
  getFileCallback: (arg1: string, arg2: File) => void
}) => {

  const fileCallbackType = () => {
    if (file.file_type === 'folder') {
      return 'openFolder'
    } else {
      return 'download'
    }
  }

  return (
    <div className={'rounded px-2 mx-1 py-5 inline-block'}>
        <div className="w-[75px] h-[75px] cursor-default">
          <div
            tabIndex={0}
            className="flex justify-center items-center flex-col"
            onDoubleClick={() => getFileCallback(fileCallbackType(), file)}
          >
            <div className="cursor-pointer w-[50px]">
              {file.icon_url ? (
                <img src={file.icon_url} className="border-2 border-gray-200 rounded max-h-24 object-fill w-[50px]" />
              ) : (
                <i className={`fa-solid fa-${getFileTypeIcon(file)} text-6xl text-orange-200`}></i>
              )}
            </div>
            <p className="text-xs break-words">{truncateText(file.name, 18)}</p>
          </div>
        </div>
      </div>
  )
}

export default SharedFileIcon
