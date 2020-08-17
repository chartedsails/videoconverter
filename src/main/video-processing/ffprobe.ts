import logger from "electron-log"
import Ffmpeg from "fluent-ffmpeg"

export const ffprobeInfo = async (filePath: string) => {
  return new Promise<Ffmpeg.FfprobeData>((resolve, reject) => {
    Ffmpeg.ffprobe(filePath, (err, videoInfo) => {
      if (err) {
        logger.warn(`ffprobe error: ${err}`)
        reject(err)
      } else {
        resolve(videoInfo)
      }
    })
  })
}

export const findTrackIndexByHandlerName = (
  info: Ffmpeg.FfprobeData,
  handlerNamePattern: string | RegExp
) => {
  const s = info.streams.find((s) => {
    const handlerName = (s as any).tags?.handler_name as string | undefined
    if (handlerName !== undefined && handlerName.match(handlerNamePattern)) {
      return true
    }
  })
  if (s) {
    return s.index
  } else {
    return -1
  }
}

export const gpmdTrackIndex = (info: Ffmpeg.FfprobeData) => {
  return findTrackIndexByHandlerName(info, "GoPro MET")
}
