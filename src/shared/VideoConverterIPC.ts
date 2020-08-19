import { TranscodingSetting } from "./TranscodingSetting"
import { Video } from "./Video"

export interface VideoConverterIPC {
  addVideo: (filepath: string) => void
  selectOutputFolder: () => void
  selectTranscoding: (t: TranscodingSetting) => void
  getSettings: () => void
  queueVideo: (v: Video) => void
  refreshAllVideos: () => void
  openPath: (path: string) => void

  setVideoUpdatedListener: (listener: (video: Video) => void) => void
  setSettingsChangeListener: (
    listener: (transcoding: TranscodingSetting, outputFolder: string) => void
  ) => void
}
