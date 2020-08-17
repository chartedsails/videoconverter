import logger from "electron-log"
import Ffmpeg from "fluent-ffmpeg"
import { Base64Stream } from "~/util/base64-stream"

export const extractBase64Thumbnail = (filepath: string) => {
  return new Promise<string>((resolve, reject) => {
    const outStream = new Base64Stream()
    const cmd = Ffmpeg()
    cmd.input(filepath)
    cmd.addInputOption("-itsoffset")
    cmd.addInputOption("-1")
    cmd.addOption("-vframes 1")
    cmd.addOption("-filter:v scale=-1:480")
    cmd.addOption("-c:v mjpeg")
    cmd.addOption("-f rawvideo")
    cmd.output(outStream, { end: true })

    cmd.on("start", (cmdLine) => {
      logger.debug(`extractBase64Thumbnail: ${cmdLine}`)
    })
    cmd.on("end", () => {
      resolve(outStream.getBase64Data("data:image/jpeg;base64, "))
    })
    cmd.on("error", (e) => {
      reject(e)
    })

    cmd.run()
  })
}
