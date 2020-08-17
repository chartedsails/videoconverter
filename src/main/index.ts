import { app, BrowserWindow } from "electron"
import * as logger from "electron-log"
import * as path from "path"
import { AppUpdater } from "./app-updater"
import { prepareFfmpeg } from "./ffmpeg-init"
import { createWindow } from "./create-window"
import { AppIPC } from "./ipc"

logger.transports.file.resolvePath = (variables) => {
  return path.join(variables.userData, variables.fileName)
}

logger.log(
  `Starting ${app.getName()} - ${process.platform}/${app.getVersion()} [${
    process.env.NODE_ENV
  }]`
)
logger.info(`Logfile: `, logger.transports.file.getFile().path)

prepareFfmpeg()
new AppIPC()

// Start the app updater
if (process.env.NODE_ENV !== "development") {
  new AppUpdater()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow()

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
