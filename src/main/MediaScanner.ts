import * as os from 'os'
import { extname, join } from 'path'
import { promises as fsPromises } from 'fs'

class MediaScanner {
  private librarys: Array<string> = []
  private recursive = true
  private songsSet = new Set<string>()

  /**
   * maintain a list of all songs' absolute path and make sure that no duplicate
   */
  public songsList = new Array<string>()

  /**
   * @param paths music librarys
   * @param recursive recursively scan or not, default to true
   */
  constructor(paths: Array<string> = [], recursive = true) {
    this.recursive = recursive
    this._processLibrarys(paths)
    console.log(this.librarys)
  }

  private allowedFormats: Array<string> = ['.mp3', '.flac', '.ogg', '.wav', '.wma']

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
    this.songsSet.clear()
    const songLists: string[][] = await Promise.all(
      this.librarys.map((path) => {
        return this.scanDirectory(path)
      })
    )
    songLists.map((list) => list.map((song) => this.songsSet.add(song)))
    this.songsList = Array.from(this.songsSet)
  }
}

export { MediaScanner }
