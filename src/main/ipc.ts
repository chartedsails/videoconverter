import { BrowserWindow, ipcMain } from "electron"
import logger from "electron-log"
import { Video } from "~/shared/Video"
import { createVideoInfo } from "./video-processing/video-info"

export class AppIPC {
  constructor() {
    ipcMain.on("add-video", async (event, filepath: string) => {
      logger.debug(`AddVideo: ${filepath}`)

      const video = await createVideoInfo("filepath")
      this.refreshVideo(video)
    })
  }

  public refreshVideo(media: Video) {
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send("update-video", media)
    }
  }
}
