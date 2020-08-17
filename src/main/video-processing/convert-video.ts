import logger from "electron-log"
import Ffmpeg from "fluent-ffmpeg"
import { ffprobeInfo, gpmdTrackIndex } from "./ffprobe"

interface VideoPreset {
  fps: number
}

export const convertVideo = async (
  input: string,
  output: string,
  preset: VideoPreset,
  onProgress?: (p: number) => void
) => {
  return new Promise<Ffmpeg.FfprobeData>(async (resolve, reject) => {
    // First extract the video info
    const info = await ffprobeInfo(input)

    const cmd = Ffmpeg().input(input)

    cmd.output(output)
    // cmd.size("640x?")
    // cmd.fpsOutput(10)
    // cmd.videoCodec("libx264")

    // Copy metadata
    cmd.addInputOption("-copy_unknown")
    cmd.addInputOption("-map_metadata 0")

    // Copy streams
    cmd.addInputOption("-c copy")
    // Re-encode video in H264
    cmd.addInputOption("-c:v h264")
    // Copy all metadata (even unknown ones)
    cmd.addInputOption("-movflags use_metadata_tags")

    // Manually map the streams we want - Always start with video and audio
    cmd.addInputOption("-map 0:v")
    cmd.addInputOption("-map 0:a")

    // Now if the input has GPMD metadata, this looks like a GoPro file and we
    // want to keep the three special track and remap them with their special
    // names
    if (gpmdTrackIndex(info) !== -1) {
      cmd.addInputOption("-map 0:d:")
    }
    cmd.addInputOption("movflags use_metadata_tags")

    /*

ffmpeg -i $1 -t 10 -copy_unknown -map_metadata 0 \
  -c copy -c:v h264 -crf 22 -pix_fmt uuvj420p \
  -movflags use_metadata_tags \
  -map 0:v -map 0:a \
  -map 0:m:handler_name:"	GoPro TCD" \
	-map 0:m:handler_name:" GoPro MET" \
  -map 0:m:handler_name:"	GoPro SOS" \
  -tag:d:1 'gpmd' -tag:d:2 'gpmd' \
  -metadata:s:v: handler='        GoPro AVC'\
  -metadata:s:a: handler='        GoPro AAC'\
  -metadata:s:d:0 handler='        GoPro TCD'\
  -metadata:s:v:1 handler='        GoPro MET'\
  -metadata:s:v:2 handler='        GoPro SOS (original fdsc stream)'\
  $2
*/
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
      onProgress?.(progress.percent / 100)
    })
    logger.info(`Converting ${input} - ${cmd._getArguments().join(" ")}`)
    cmd.run()
  })
}
