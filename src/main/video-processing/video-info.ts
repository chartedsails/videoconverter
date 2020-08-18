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

  const video: Video = {
    ...v,
    status: "ready",
    size: stats.size,
    resolution: `${videoTrack.coded_width}x${videoTrack.coded_height}`,
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
