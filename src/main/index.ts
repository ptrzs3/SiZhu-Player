import { app, BrowserWindow, net, protocol } from 'electron'
import { EventsProcessor } from './EventsProcessor'
import { electronApp, optimizer } from '@electron-toolkit/utils'
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'sizhu',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true
    }
  }
])
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  protocol.handle('sizhu', (request) => net.fetch('file://' + request.url.slice('sizhu://'.length)))
  const ep = new EventsProcessor()
  ep.createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) ep.createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
