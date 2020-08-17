import { BrowserWindow } from "electron"
import path from "path"

export function createWindow() {
  const mainWindow = new BrowserWindow({
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    width: 1200,
  })

  // and load the index.html of the app.
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:4000")
  } else {
    const index = path.join(__dirname, "/renderer/index.html")
    mainWindow.loadFile(index)
  }
}
