import icon from '../../resources/icon.png?asset'
import { join } from 'path'
import { shell, BrowserWindow, protocol, net } from 'electron'
import { is } from '@electron-toolkit/utils'
import path from 'path'
import fs from 'fs'
class EventsProcessor {
  createWindow(): void {
    const mainWindow = new BrowserWindow({
      width: 900,
      height: 670,
      show: false,
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/preload.js'),
        sandbox: false,
        contextIsolation: true
      }
    })
    mainWindow.on('ready-to-show', () => {
      mainWindow.show()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
    mainWindow.webContents.openDevTools()
  }

  // async registerFileProtocol() {
  //   protocol.handle('sizhu', async (request: Request) => {
  //     const url = request.url.replace('sizhu://', '').replace(/\/$/, '')
  //     const filePath = path.normalize(decodeURIComponent(url))
  //     const data = await fs.promises.readFile(filePath)
  //     return new Response(data, {
  //       status: 200,
  //       statusText: 'OK',
  //       headers: { 'Content-Type': 'audio/mpeg' }
  //     })
  //   })
  // }
}

export { EventsProcessor }
