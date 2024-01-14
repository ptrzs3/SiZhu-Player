import { app, BrowserWindow, protocol } from 'electron'
import { EventsProcessor } from './EventsProcessor'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { DataSource } from 'typeorm'
import { join } from 'path'
import {Photo} from '../main/database/entity/Song'
import 'reflect-metadata'
// must run before app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'plebeia',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true
    }
  }
])

function OnReady() {
  const appSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'plebeia',
    entities: [join(__dirname, 'database', 'entity', '*.ts')]
  })
  appSource
    .initialize()
    .then()
    .catch((error) => console.log(error))
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
