import * as logger from "electron-log"
import Ffmpeg from "fluent-ffmpeg"

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path.replace(
  "app.asar",
  "app.asar.unpacked"
)
const ffprobePath = require("@ffprobe-installer/ffprobe").path.replace(
  "app.asar",
  "app.asar.unpacked"
)

export const prepareFfmpeg = () => {
  logger.debug(`Setting ffmpeg paths to ${ffmpegPath}`)

  Ffmpeg.setFfmpegPath(ffmpegPath)
  Ffmpeg.setFfprobePath(ffprobePath)

  Ffmpeg.getAvailableCodecs((err, codecs) => {
    if (err) {
      logger.error(`Error - ffmpeg unavailable: ${err}`)
    }
  })
}
