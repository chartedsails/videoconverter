import logger from "electron-log"
import Ffmpeg from "fluent-ffmpeg"
import { TranscodingSetting } from "~/shared/TranscodingSetting"
import { ffprobeInfo, gpmdTrackIndex } from "./ffprobe"

export const convertVideo = async (
  input: string,
  output: string,
  transcodeSetting: TranscodingSetting,
  onProgress?: (p: number, remainingTime?: number) => void
) => {
  return new Promise<Ffmpeg.FfprobeData>(async (resolve, reject) => {
    // First extract the video info
    const info = await ffprobeInfo(input)

    const cmd = Ffmpeg().input(input)

    cmd.output(output)

    // Copy metadata
    cmd.addOption("-copy_unknown")
    cmd.addOption("-map_metadata 0")

    // Copy streams
    cmd.addOption("-c copy")
    // Re-encode video in H264
    cmd.addOption("-c:v h264")
    cmd.addOption(`-vf scale=-2:${transcodeSetting.maxLines}`)
    // Copy all metadata (even unknown ones)
    cmd.addOption("-movflags use_metadata_tags")

    // Manually map the streams we want - Always start with video and audio
    cmd.addOption("-map 0:v")
    cmd.addOption("-map 0:a")

    // Now if the input has GPMD metadata, this looks like a GoPro file and we
    // want to keep the three special track and remap them with their special
    // names
    if (gpmdTrackIndex(info) !== -1) {
      cmd.addOption("-map 0:d:")
    }

    const startTime = Date.now()
    cmd.on("end", () => {
      resolve()
    })
    cmd.on("error", (e) => {
      reject(e)
    })
    cmd.on("progress", (progress) => {
      logger.debug(
        `Converting ${input} - Progress: ${JSON.stringify(progress)}`
      )
      const p = progress.percent / 100
      const elapsed = Date.now() - startTime
      const remainingTime = elapsed * (1 / p - 1)
      // Time estimate is very unreliable in the beginning...
      if (p > 0.05 && elapsed > 10000) {
        onProgress?.(p, remainingTime)
      } else {
        onProgress?.(p)
      }
    })
    logger.info(`Converting ${input} - ${cmd._getArguments().join(" ")}`)
    cmd.run()
  })
}
