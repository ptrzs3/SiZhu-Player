import icon from '../../resources/icon.png?asset'
import { join } from 'path'
import { shell, BrowserWindow, protocol, net, ipcMain } from 'electron'
import { is } from '@electron-toolkit/utils'
import { MediaScanner } from './MediaScanner'
import { Player } from './Player'

class EventsProcessor {
  scanner = new MediaScanner()
  player = new Player()

  constructor() {
    this.registerIpcMainChannel()
    this.registerFileProtocol()
    this.scanner.scanDirectories()
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
    const driveLetterRegex = /plebeia:\/\/([a-zA-Z]+)\//
    const url = request.url.replace(driveLetterRegex, (_match, driveLetters) => {
      return `${driveLetters}:/`
    })
    return await net.fetch('file:///' + decodeURIComponent(url))
  }

  private registerFileProtocol() {
    protocol.handle('plebeia', this._handler)
  }
  private registerIpcMainChannel() {
    ipcMain.handle('newsong', () => {
      const randint = Math.floor(Math.random() * (this.scanner.songsList.length + 1))
      return 'plebeia://' + this.scanner.songsList[randint]
    })
  }
}

export { EventsProcessor }
