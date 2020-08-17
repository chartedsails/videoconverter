import Ffmpeg from "fluent-ffmpeg"
import fs from "fs"
import { v4 } from "uuid"
import { Video } from "~/shared/Video"
import { ffprobeInfo, gpmdTrackIndex } from "./ffprobe"

export const createVideoInfo = async (filepath: string): Promise<Video> => {
  // First check that the file exists
  if (!fs.existsSync(filepath)) {
    throw new Error("File does not exist.")
  }

  const stats = fs.statSync(filepath)
  const ffinfo = await ffprobeInfo(filepath)

  // eslint-disable-next-line no-console
  // console.log(`ffprobeInfo: ${JSON.stringify(ffinfo, undefined, 2)}`)

  const videoTrack = ffinfo.streams.find((s) => s.codec_type === "video")
  if (videoTrack === undefined) {
    throw new Error("This file does not seem to contain a video.")
  }

  const video: Video = {
    id: v4(),
    filepath,
    size: stats.size,
    duration: Number.parseFloat(videoTrack.duration) * 1000,
    needConversion: needsConversion(videoTrack),
    goproTelemetry: gpmdTrackIndex(ffinfo) !== -1,
  }
  return video
}

const needsConversion = (videoStream: Ffmpeg.FfprobeStream) => {
  if (videoStream.codec_name === "hevc") {
    return true
  }
  return false
}
