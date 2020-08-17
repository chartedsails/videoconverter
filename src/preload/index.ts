import logger from "electron-log"
import { ipcRenderer, contextBridge } from "electron"
import { VideoConverterIPC } from "~/shared/VideoConverterIPC"

logger.info("Preload")

const ipcBridge: VideoConverterIPC = {
  addVideo: (filepath) => {
    logger.debug(`IPC => add-video(${filepath})`)
    ipcRenderer.send("add-video", filepath)
  },
  setVideoUpdatedListener: (listener) => {
    ipcRenderer.removeAllListeners("update-video")
    ipcRenderer.on("update-video", (event, video) => {
      logger.debug(`IPC <= video-update`, video)
      listener(video)
    })
  },
}

contextBridge.exposeInMainWorld("chartedSailsVideoConverter", ipcBridge)
