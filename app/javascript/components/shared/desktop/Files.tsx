import React, { ReactElement } from 'react'
import { File } from '@models/File'
import { SortableFile } from './SortableFile'
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

export const Files = ({ id, files, selectedFiles, fileCallback }: { id: string; files: File[]; selectedFiles: string[]; fileCallback: () => {} }): ReactElement => {
  const { setNodeRef } = useDroppable({
    id
  })

  return (
    <SortableContext id="desktop-files" items={files} strategy={horizontalListSortingStrategy}>
      <div ref={setNodeRef} className="flex flex-wrap">
        {files.map((file) => {
          const active = selectedFiles.includes(file.id)
          return <SortableFile key={file.id} selected={active} file={file} fileCallback={fileCallback} />
        })}
      </div>
    </SortableContext>
  )
}

export default Files
