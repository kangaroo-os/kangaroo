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

const getDesktopFiles = (fileStore: { [id: string]: File[] }) => {
  return fileStore['0']
}

const getWindows = (fileStore: { [id: string]: File[] }) => {
  const windows = { ...fileStore }
  delete windows['0']
  return windows
}

export { getDesktopFiles, getWindows, setDefaultPath, getDefaultPath }
