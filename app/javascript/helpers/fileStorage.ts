import { FileStorage } from '@states/desktopState'

const store = {
  desktopPath: '' 
}

const setDefaultPath = (path: string) => {
  store['desktopPath'] = path
}

const getDefaultPath = () => {
  return store['desktopPath']
}

const getDesktopFiles = (fileStore: FileStorage) => {
  return fileStore[getDefaultPath()]
}

const getWindows = (fileStore: FileStorage) => {
  const windows = { ...fileStore }
  delete windows[getDefaultPath()]
  return windows
}

export { getDesktopFiles, getWindows, setDefaultPath, getDefaultPath }