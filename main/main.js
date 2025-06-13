const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('renderer/index.html')
}

app.disableHardwareAcceleration()
app.whenReady().then(() => {
  createWindow()
})