import { contextBridge, ipcRenderer } from "electron"
import logger from "electron-log"
import { TranscodingSetting } from "~/shared/TranscodingSetting"
import { Video } from "~/shared/Video"
import { VideoConverterIPC } from "~/shared/VideoConverterIPC"

logger.info("Preload")

const ipcBridge: VideoConverterIPC = {
  addVideo: (filepath) => {
    logger.debug(`IPC => add-video(${filepath})`)
    ipcRenderer.send("add-video", filepath)
  },
  getSettings: () => {
    ipcRenderer.send("get-settings")
  },
  selectOutputFolder: () => {
    logger.debug(`IPC => select-output-folder`)
    ipcRenderer.send("select-output-folder")
  },
  selectTranscoding: (t: TranscodingSetting) => {
    logger.debug(`IPC => select-transcodign`)
    ipcRenderer.send("select-transcoding", t)
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
  setSettingsChangeListener: (listener) => {
    ipcRenderer.removeAllListeners("settings-change")
    ipcRenderer.on("settings-change", (event, t, f) => {
      logger.debug(`IPC <= settings-change`, t, f)
      listener(t, f)
    })
  },
}

contextBridge.exposeInMainWorld("chartedSailsVideoConverter", ipcBridge)
