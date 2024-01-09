import * as os from 'os'
import { extname, join } from 'path'
import { promises as fsPromises } from 'fs'

class MediaScanner {
  /**
   *
   * @param paths music librarys
   */
  constructor(paths: Array<string> = [], recursive = true) {
    this.recursive = recursive
    this._processLibrarys(paths)
    console.log(this.librarys)
  }

  /**
   * music librarys or default to USER.MUSIC
   */
  private librarys: Array<string> = []
  songs = new Set<string>()

  private allowedFormats: Array<string> = ['.mp3', '.flac', '.ogg', '.wav', '.wma']

  /**
   * recursively scan or not, default to true
   */
  recursive = true

  _processLibrarys(paths: Array<string>) {
    // User passed the paths
    if (paths.length) {
      this.librarys = paths
      console.log(paths)
    } else {
      switch (os.platform()) {
        case 'win32':
          if (process.env.USERPROFILE) {
            this.librarys = [join(process.env.USERPROFILE, 'Music')]
          } else {
            this.librarys = ['']
          }
          break
        case 'darwin':
          this.librarys = [join(os.homedir(), 'Music/Music/Media.localized')]
          break
        case 'linux':
          this.librarys = [join(os.homedir(), 'Music')]
          break
        default:
          console.error('sorry, unsupported platform')
      }
    }
  }

  private async scanDirectory(dir = ''): Promise<string[]> {
    if (!dir.length) {
      return ['']
    }
    let items = await fsPromises.readdir(dir, {
      recursive: this.recursive
    })
    items = items.filter((item) => {
      return this.allowedFormats.includes(extname(item))
    })
    return items.map((item) => join(dir, item))
  }

  async scanDirectories() {
    this.songs.clear()
    // console.time('start')
    const songLists: string[][] = await Promise.all(
      this.librarys.map((path) => {
        return this.scanDirectory(path)
      })
    )
    songLists.map((list) => list.map((song) => this.songs.add(song)))
    // console.timeEnd('start')
    // this.songs.forEach((song) => console.log(song))
  }
}

export { MediaScanner }
