import { app, BrowserWindow, protocol } from 'electron'
import { EventsProcessor } from './EventsProcessor'
import { electronApp, optimizer } from '@electron-toolkit/utils'

// must run before app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'sizhu',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true
    }
  }
])

function OnReady() {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const ep = new EventsProcessor()
  ep.createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) ep.createWindow()
  })
}

app.on('ready', OnReady)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
