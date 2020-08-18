import { app, BrowserWindow, dialog, ipcMain } from "electron"
import logger from "electron-log"
import fs from "fs"
import path from "path"
import { v4 } from "uuid"
import {
  transcodingOptions,
  TranscodingSetting,
} from "~/shared/TranscodingSetting"
import { QueuedVideo, Video } from "~/shared/Video"
import { convertVideo } from "./video-processing/convert-video"
import { extractBase64Thumbnail } from "./video-processing/extract-thumbnail"
import { getVideoInfo } from "./video-processing/video-info"

export class AppIPC {
  private transcodeSetting: TranscodingSetting
  private outputFolder: string
  private videos: Video[]

  constructor() {
    this.loadPreferences()
    this.videos = []

    ipcMain.on("add-video", async (event, filepath: string) => {
      logger.debug(`AddVideo: ${filepath}`)

      // Skip if we already have this video
      if (this.videos.find((v) => v.filepath === filepath)) {
        return
      }

      try {
        let video: Video = { id: v4(), status: "adding", filepath }
        this.refreshVideo(video)

        video = await getVideoInfo(video)
        this.refreshVideo(video)

        if (video.status === "ready") {
          video.thumbnailData = await extractBase64Thumbnail(filepath)
          video = this.updateVideoReadiness(video)
          this.refreshVideo(video)

          this.videos.push(video)
        }
      } catch (e) {
        logger.error(e)
      }
    })

    ipcMain.on("queue-video", async (event, video: Video) => {
      logger.debug(`QueueVideo: ${video.filepath}`)

      const index = this.videos.findIndex((v) => v.id === video.id)
      const v = this.videos[index]
      if (index !== -1 && v.status === "ready") {
        this.videos[index] = {
          ...v,
          status: "queued",
          convertedPath: this.videoDestinationPath(video),
        }
        this.refreshVideo(this.videos[index])
      } else {
        logger.warn(`queue-video called for non-existent video`, video)
      }
      this.processNextInQueue()
    })

    ipcMain.on("select-output-folder", async () => {
      const mainWindow = BrowserWindow.getAllWindows()[0]
      const result = await dialog.showOpenDialog(mainWindow, {
        title: "Select destination folder",
        defaultPath: this.outputFolder,
        properties: ["openDirectory", "createDirectory"],
      })
      if (!result.canceled && result.filePaths.length > 0) {
        this.outputFolder = result.filePaths[0]
        this.refreshSettings()
        this.savePreferences()

        this.videos = this.videos.map((v) => this.updateVideoReadiness(v))
        this.videos.forEach((v) => this.refreshVideo(v))
      }
    })

    ipcMain.on("select-transcoding", (e, t: TranscodingSetting) => {
      this.transcodeSetting = t
      this.refreshSettings()
      this.savePreferences()
    })

    ipcMain.on("get-settings", () => {
      this.refreshSettings()
    })

    ipcMain.on("refresh-all-videos", () => {
      this.videos.forEach((v) => this.refreshVideo(v))
    })
  }

  public refreshVideo(media: Video) {
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send("update-video", media)
    }
  }
  public refreshSettings() {
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send(
        "settings-change",
        this.transcodeSetting,
        this.outputFolder
      )
    }
  }

  private async processNextInQueue() {
    const processingVideos = this.videos.filter(
      (v) => v.status === "converting"
    )
    if (processingVideos.length > 0) {
      logger.debug(
        `processNextInQueue: processing already in progress - bailing out.`
      )
      return
    }

    const queuedVideos = this.videos.filter((v) => v.status === "queued")
    if (queuedVideos.length === 0) {
      logger.debug(`processNextInQueue: queue empty.`)
      return
    }

    const video = queuedVideos[0] as QueuedVideo
    logger.info(`processNextInQueue: process ${video.filepath}`)
    const updateVideo = (v: Video) => {
      const index = this.videos.findIndex((v) => v.id === video.id)
      this.videos[index] = v
      this.refreshVideo(v)
    }

    updateVideo({ ...video, status: "converting", progress: 0 })

    try {
      await convertVideo(
        video.filepath,
        video.convertedPath,
        this.transcodeSetting,
        (progress, remainingTime) => {
          updateVideo({
            ...video,
            status: "converting",
            progress,
            remainingTime,
          })
        }
      )
      const convertedSize = fs.statSync(video.convertedPath).size
      updateVideo({ ...video, status: "converted", convertedSize })
    } catch (e) {
      updateVideo({ ...video, status: "conversion-error", error: e.message })
    }

    // Process Next video (if it exists)
    this.processNextInQueue()
  }

  private updateVideoReadiness(video: Video) {
    const destinationPath = this.videoDestinationPath(video)
    if (video.status === "ready" || video.status === "not-ready") {
      if (fs.existsSync(destinationPath)) {
        video = {
          ...video,
          status: "not-ready",
          error: "Destination file already exists.",
        }
      } else {
        video = { ...video, status: "ready" }
      }
    }
    return video
  }

  private videoDestinationPath(video: Video) {
    const filename =
      path.basename(video.filepath, path.extname(video.filepath)) + ".mov"
    return path.join(this.outputFolder, filename)
  }

  private preferencesPath() {
    return path.join(app.getPath("appData"), "preferences.json")
  }

  private loadPreferences() {
    try {
      const prefs = JSON.parse(fs.readFileSync(this.preferencesPath(), "utf-8"))
      this.outputFolder = prefs.outputFolder
      this.transcodeSetting = transcodingOptions.find(
        (o) => o.name === prefs.transcodeSetting.name
      )
    } catch (e) {
      logger.warn(`Error loading preferences: `, e)
    }
    if (!this.transcodeSetting) {
      this.transcodeSetting = transcodingOptions[0]
    }
    if (!this.outputFolder || !fs.existsSync(this.outputFolder)) {
      this.outputFolder = path.join(app.getPath("videos"), "ChartedSails")
      if (!fs.existsSync(this.outputFolder)) {
        fs.mkdirSync(this.outputFolder, { recursive: true })
      }
    }
  }

  private savePreferences() {
    const prefs = {
      transcodeSetting: this.transcodeSetting,
      outputFolder: this.outputFolder,
    }
    fs.writeFileSync(this.preferencesPath(), JSON.stringify(prefs), {
      encoding: "utf-8",
    })
  }
}
