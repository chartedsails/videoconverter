import { BrowserWindow, ipcMain } from "electron"
import logger from "electron-log"
import { Video } from "~/shared/Video"
import { extractBase64Thumbnail } from "./video-processing/extract-thumbnail"
import { createVideoInfo } from "./video-processing/video-info"

export class AppIPC {
  constructor() {
    ipcMain.on("add-video", async (event, filepath: string) => {
      logger.debug(`AddVideo: ${filepath}`)

      try {
        const video = await createVideoInfo(filepath)
        this.refreshVideo(video)
        video.thumbnailData = await extractBase64Thumbnail(filepath)
        this.refreshVideo(video)
      } catch (e) {
        logger.error(e)
      }
    })
  }

  public refreshVideo(media: Video) {
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send("update-video", media)
    }
  }
}
