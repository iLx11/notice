const { ipcMain, BrowserWindow, screen } = require('electron')

export const windowControlListener = () => {
  // 获取屏幕尺寸
  ipcMain.handle('get-screen-size', () => {
    const primaryDisplay = screen.getPrimaryDisplay()
    // console.info(primaryDisplay)
    return primaryDisplay.size
  })
  // 窗口置顶
  ipcMain.on('window-on-top', (event, state) => {
    const webContent = event.sender
    const win = BrowserWindow.fromWebContents(webContent)
    win.setAlwaysOnTop(state)
  })

  // 最小化
  ipcMain.on('window-min', event => {
    const webContent = event.sender
    const win = BrowserWindow.fromWebContents(webContent)
    win.minimize()
  })

  // 最大化
  ipcMain.on('window-max', (event, state, windowSize = {}) => {
    const webContent = event.sender
    const win = BrowserWindow.fromWebContents(webContent)
    // // console.info(state)
    if (state) {
      // 获取当前屏幕的大小
      const { width: screenWidth, height: screenHeight } =
        screen.getPrimaryDisplay().workAreaSize

      // 计算窗口居中的位置
      const x = Math.round((screenWidth - windowSize.width) / 2)
      const y = Math.round((screenHeight - windowSize.height) / 2)
      // win.unmaximize()
      win.setBounds({ ...windowSize, x, y })
    } else {
      win.maximize()
    }
  })

  // 关闭
  ipcMain.on('window-close', event => {
    const webContent = event.sender
    const win = BrowserWindow.fromWebContents(webContent)
    // delete CreateWindow.group[event.frameId - 1]
    win.close()
  })

  // 窗口隐藏
  ipcMain.on('window-hide', event => {
    const webContent = event.sender
    const win = BrowserWindow.fromWebContents(webContent)
    // delete CreateWindow.group[event.frameId - 1]
    win.hide()
  })
}
