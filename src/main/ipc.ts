import { app, BrowserWindow, dialog, ipcMain, shell } from "electron"
import logger from "electron-log"
import { FfmpegCommand } from "fluent-ffmpeg"
import fs from "fs"
import path from "path"
import { v4 } from "uuid"
import { openVideoConverterAboutWindow } from "~/shared/about-window"
import {
  transcodingOptions,
  TranscodingSetting,
} from "~/shared/TranscodingSetting"
import { QueuedVideo, Video } from "~/shared/Video"
import { AppError } from "~/shared/VideoConverterIPC"
import { convertVideo } from "./video-processing/convert-video"
import { extractBase64Thumbnail } from "./video-processing/extract-thumbnail"
import { getVideoInfo } from "./video-processing/video-info"

export class AppIPC {
  private transcodeSetting: TranscodingSetting
  private outputFolder: string
  private videos: Video[]
  private runningCommand?: FfmpegCommand

  constructor() {
    this.loadPreferences()
    this.videos = []

    ipcMain.on("add-video", async (event, filepath: string) => {
      logger.debug(`AddVideo: ${filepath}`)

      // Skip if we already have this video
      if (this.videos.find((v) => v.filepath === filepath)) {
        return
      }

      let video: Video = { id: v4(), status: "adding", filepath }
      this.refreshVideo(video)

      try {
        video = await getVideoInfo(video)
        this.refreshVideo(video)

        if (video.status === "ready") {
          video.thumbnailData = await extractBase64Thumbnail(filepath)
          video = this.updateVideoReadiness(video)
          this.refreshVideo(video)
        }
      } catch (e) {
        logger.error(e)
        this.reportError({
          title: "Cannot add file",
          message: "This does not look like a video file.",
          details: e.message,
          filename: path.basename(filepath),
        })
        const index = this.videos.findIndex((v) => v.id === video.id)
        this.videos.splice(index, 1)
        this.refreshAllVideos()
      }
    })

    ipcMain.on("queue-video", async (event, video: Video) => {
      logger.debug(`QueueVideo: ${video.filepath}`)

      const v = this.videos.find((v) => v.id === video.id)
      if (v && v.status === "ready") {
        this.refreshVideo({
          ...v,
          status: "queued",
          convertedPath: this.videoDestinationPath(video),
        })
      } else {
        logger.warn(`queue-video called for non-existent video`, video)
      }
      this.processNextInQueue()
    })

    ipcMain.on("remove-video", async (event, video: Video) => {
      logger.debug(`RemoveVideo: ${video}`)
      const index = this.videos.findIndex((v) => v.id === video.id)
      if (index !== -1) {
        const v = this.videos[index]
        if (v.status === "converting" && this.runningCommand) {
          this.runningCommand.kill("SIGKILL")
          try {
            fs.unlinkSync(v.convertedPath)
          } catch {}
        }
        this.videos.splice(index, 1)
      }
      this.refreshAllVideos()
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
        this.refreshAllVideos()
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
      this.refreshAllVideos()
    })
    ipcMain.on("open-path", (e, path: string) => {
      shell.openPath(path)
    })
    ipcMain.on("open-about", (e) => {
      openVideoConverterAboutWindow()
    })
  }

  public refreshVideo(video: Video) {
    const index = this.videos.findIndex((v) => v.id === video.id)
    if (index !== -1) {
      this.videos[index] = video
    } else {
      this.videos.push(video)
    }
    this.refreshAllVideos()
  }

  public refreshAllVideos() {
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send("update-videos", this.videos)
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

  public reportError(e: AppError) {
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send("error", e)
    }
  }

  public killRunningConversion() {
    if (this.runningCommand) {
      this.runningCommand.kill("SIGKILL")

      const v = this.videos.find((v) => v.status === "converting")
      if (v && v.status === "converting") {
        fs.unlinkSync(v.convertedPath)
      }
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
        {
          onProgress: (progress, remainingTime) => {
            updateVideo({
              ...video,
              status: "converting",
              progress,
              remainingTime,
            })
            BrowserWindow.getAllWindows().forEach((bw) =>
              bw.setProgressBar(progress)
            )
          },
          onCmdStarted: (cmd) => (this.runningCommand = cmd),
        }
      )
      this.runningCommand = undefined
      const convertedSize = fs.statSync(video.convertedPath).size
      updateVideo({ ...video, status: "converted", convertedSize })
    } catch (e) {
      if (this.videos.find((v) => v.id === video.id)) {
        updateVideo({ ...video, status: "conversion-error", error: e.message })
      }
      // if the video is not in the list, the user probably interrupted it.
    }
    BrowserWindow.getAllWindows().forEach((bw) => bw.setProgressBar(-1))

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
