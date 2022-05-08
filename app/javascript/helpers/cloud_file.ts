import { CloudFile } from '../models/CloudFile'
export function getFileTypeIcon(file: CloudFile): string {
  const type = file.file_type
  switch (true) {
    case type === 'folder':
      return 'folder'
    case type.includes('image'):
      return 'file-image'
    case type.includes('video'):
      return 'file-video'
    case type.includes('audio'):
      return 'file-audio'
    case type.includes('pdf'):
      return 'file-pdf'
    default:
      return 'file'
  }
}
