/* eslint-disable @typescript-eslint/no-empty-function */
import { SongItem } from './SongItem'

class Player {
  private song!: SongItem
  private playList: Array<string> = []
  constructor() {}
  play() {}
  pause() {}
  stop() {}
  next() {}
  prev() {}
  scan() {}
  changeMode() {}
  volumeUp() {}
  volumeDown() {}
  like() {}
  cutInPlayList() {}
  addToPlayList() {}
  removeFromPlayList() {}
  clearPlayList() {}
}

export { Player }
