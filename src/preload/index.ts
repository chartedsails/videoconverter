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
  removeVideo: (video) => {
    logger.debug(`IPC => remove-video(${video.id} ${video.filepath})`)
    ipcRenderer.send("remove-video", video)
  },
  getSettings: () => {
    ipcRenderer.send("get-settings")
  },
  selectOutputFolder: () => {
    logger.debug(`IPC => select-output-folder`)
    ipcRenderer.send("select-output-folder")
  },
  selectTranscoding: (t: TranscodingSetting) => {
    logger.debug(`IPC => select-transcoding`)
    ipcRenderer.send("select-transcoding", t)
  },
  queueVideo: (v: Video) => {
    logger.debug(`IPC => queue-video`)
    ipcRenderer.send("queue-video", v)
  },
  refreshAllVideos: () => {
    logger.debug(`IPC => refresh-all-videos`)
    ipcRenderer.send("refresh-all-videos")
  },
  openPath: (path) => {
    logger.debug(`IPC => open-path`)
    ipcRenderer.send("open-path", path)
  },
  openAbout: () => {
    logger.debug(`IPC => open-about`)
    ipcRenderer.send("open-about")
  },
  setVideosUpdatedListener: (listener) => {
    ipcRenderer.removeAllListeners("update-videos")
    ipcRenderer.on("update-videos", (event, videos: Video[]) => {
      logger.debug(`IPC <= update-videos`)
      listener(videos)
    })
  },
  setSettingsChangeListener: (listener) => {
    ipcRenderer.removeAllListeners("settings-change")
    ipcRenderer.on("settings-change", (event, t, f) => {
      logger.debug(`IPC <= settings-change`, t, f)
      listener(t, f)
    })
  },
  setErrorListener: (listener) => {
    ipcRenderer.removeAllListeners("error")
    ipcRenderer.on("error", (event, e) => {
      logger.debug(`IPC <= error`, e)
      listener(e)
    })
  },
}

contextBridge.exposeInMainWorld("chartedSailsVideoConverter", ipcBridge)
