import icon from '../../resources/icon.png?asset'
import { join } from 'path'
import { shell, BrowserWindow, protocol, net } from 'electron'
import { is } from '@electron-toolkit/utils'

class EventsProcessor {
  constructor() {
    this.registerFileProtocol()
  }

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

  private async _handler(request: Request): Promise<Response> {
    const url = request.url.replace('sizhu://', '')
    return await net.fetch('file:///' + url)
  }

  private registerFileProtocol() {
    protocol.handle('sizhu', this._handler)
  }
}

export { EventsProcessor }
