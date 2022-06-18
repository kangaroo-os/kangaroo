import { WindowContent } from '@models/Desktop'

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

const getDesktopFiles = (windows: WindowContent) => {
  return windows[getDesktopId()]
}

const getFolders = (windows: WindowContent) => {
  const copiedWindows = { ...windows }
  delete copiedWindows[getDesktopId()]
  return copiedWindows
}

export { getDesktopFiles, getFolders, setDefaultPath, getDefaultPath, getDesktopId }
