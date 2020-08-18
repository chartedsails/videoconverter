import { app, BrowserWindow, dialog, ipcMain } from "electron"
import logger from "electron-log"
import fs from "fs"
import path from "path"
import { v4 } from "uuid"
import {
  transcodingOptions,
  TranscodingSetting,
} from "~/shared/TranscodingSetting"
import { Video } from "~/shared/Video"
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

  private updateVideoReadiness(video: Video) {
    const destinationPath = path.join(
      this.outputFolder,
      path.basename(video.filepath)
    )
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
