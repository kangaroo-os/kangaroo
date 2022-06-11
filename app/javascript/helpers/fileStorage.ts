import { FileStorage } from '@states/desktopState'

const store = {
  desktopPath: '' 
}

const setDefaultPath = (path: string) => {
  if (!store['desktopPath'])
    store['desktopPath'] = path
  else
    alert('You can only set the default path once')
}

const getDefaultPath = () => {
  return store['desktopPath']
}

const getDesktopFiles = (fileStore: FileStorage) => {
  return fileStore[getDefaultPath()]
}

const getWindows = (fileStore: FileStorage) => {
  delete fileStore[getDefaultPath()]
  return fileStore
}

export { getDesktopFiles, getWindows, setDefaultPath, getDefaultPath }