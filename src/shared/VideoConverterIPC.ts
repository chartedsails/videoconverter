import { TranscodingSetting } from "./TranscodingSetting"
import { Video } from "./Video"

export interface AppError {
  title: string
  message: string
  filename?: string
  details?: string
}

export interface VideoConverterIPC {
  addVideo: (filepath: string) => void
  selectOutputFolder: () => void
  selectTranscoding: (t: TranscodingSetting) => void
  getSettings: () => void
  queueVideo: (v: Video) => void
  refreshAllVideos: () => void
  openPath: (path: string) => void
  openAbout: () => void
  removeVideo: (video: Video) => void
  startDragging: (video: Video) => void

  setVideosUpdatedListener: (listener: (videos: Video[]) => void) => void
  setSettingsChangeListener: (
    listener: (transcoding: TranscodingSetting, outputFolder: string) => void
  ) => void
  setErrorListener: (listener: (e: AppError) => void) => void
}
