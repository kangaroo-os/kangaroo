import { File } from '@models/File'
const store = {
  desktopPath: '',
}

const setDefaultPath = (path: string) => {
  store['desktopPath'] = path
}

const getDefaultPath = () => {
  return store['desktopPath']
}

const getDesktopId = () => {
  return '0'
}

const getDesktopFiles = (fileStore: { [id: string]: File[] }) => {
  return fileStore[getDesktopId()]
}

const getWindows = (fileStore: { [id: string]: File[] }) => {
  const windows = { ...fileStore }
  delete windows[getDesktopId()]
  return windows
}

export { getDesktopFiles, getWindows, setDefaultPath, getDefaultPath, getDesktopId }
