import { File } from '../models/File'
export function getFileTypeIcon(file: File): string {
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
    case type.includes('link'):
      return 'file-arrow-up'
    default:
      return 'file'
  }
}
