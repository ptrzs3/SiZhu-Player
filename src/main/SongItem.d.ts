interface SongItem {
  // constructor() {}
  fileName: string
  title: string
  artists?: Array<string>
  duration: number
  lyrics?: Array<string>
  playing: boolean
}
