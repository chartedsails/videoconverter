import { contextBridge, ipcRenderer } from "electron"
import logger from "electron-log"
import { Video } from "~/shared/Video"
import { VideoConverterIPC } from "~/shared/VideoConverterIPC"

logger.info("Preload")

const ipcBridge: VideoConverterIPC = {
  addVideo: (filepath) => {
    logger.debug(`IPC => add-video(${filepath})`)
    ipcRenderer.send("add-video", filepath)
  },
  setVideoUpdatedListener: (listener) => {
    ipcRenderer.removeAllListeners("update-video")
    ipcRenderer.on("update-video", (event, video: Video) => {
      const loggedVideo: Video = {
        ...video,
        thumbnailData: video.thumbnailData?.slice(0, 42) + "...",
      }
      logger.debug(`IPC <= video-update`, loggedVideo)
      listener(video)
    })
  },
}

contextBridge.exposeInMainWorld("chartedSailsVideoConverter", ipcBridge)
