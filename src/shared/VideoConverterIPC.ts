import { Video } from "./Video"

export interface VideoConverterIPC {
  addVideo: (filepath: string) => void
  setVideoUpdatedListener: (listener: (video: Video) => void) => void
}
