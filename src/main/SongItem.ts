import { IPicture, parseFile } from 'music-metadata'
import * as NodeID3 from 'node-id3'
import { basename } from 'path'
import * as crypto from 'crypto'
class SongItem {
  // md5(title + bitrate + duration(ms))
  // 真的爱你128266254
  // d705cf0b498b357b93b6300804ac7e6b
  id!: string
  filePath: string
  fileName: string
  title!: string
  artists!: Array<string>
  album!: string
  duration!: number
  playing: boolean
  lyrics!: string
  cover!: IPicture[]
  constructor(fp: string) {
    this.filePath = fp
    this.fileName = basename(this.filePath).split('.')[0]
    this.playing = false
  }
  async getMetadata() {
    const mm = await parseFile(this.filePath, { duration: true })
    this.title = mm.common.title || this.fileName
    this.artists = mm.common.artists || []
    this.album = mm.common.album || ''
    this.duration = mm.format.duration || -1
    this.cover = mm.common.picture || []
    this.lyrics =
      NodeID3.read(this.filePath, { include: ['USLT'] }).unsynchronisedLyrics?.text || ''
    this.id = crypto
      .createHash('md5')
      .update(this.title + mm.format.bitrate + this.duration + this.album)
      .digest('hex')
  }
}
export { SongItem }
