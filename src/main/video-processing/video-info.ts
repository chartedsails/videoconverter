import Ffmpeg from "fluent-ffmpeg"
import fs from "fs"
import { Video } from "~/shared/Video"
import { ffprobeInfo, gpmdTrackIndex } from "./ffprobe"

export const getVideoInfo = async (v: Video): Promise<Video> => {
  const stats = fs.statSync(v.filepath)
  const ffinfo = await ffprobeInfo(v.filepath)

  const videoTrack = ffinfo.streams.find((s) => s.codec_type === "video")
  if (videoTrack === undefined) {
    throw new Error("This file does not seem to contain a video.")
  }

  let framerate = videoTrack.r_frame_rate
  const matches = framerate.match(/(\d+)\/(\d+)/)
  let fps = Number.parseFloat(framerate)
  if (matches) {
    fps =
      Math.round(
        (100 * Number.parseFloat(matches[1])) / Number.parseFloat(matches[2])
      ) / 100
  }
  const video: Video = {
    ...v,
    status: "ready",
    size: stats.size,
    width: videoTrack.coded_width,
    height: videoTrack.coded_height,
    framerate: fps,
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
