interface BasicVideoProps {
  id: string
  filepath: string
}

interface VideoProps extends BasicVideoProps {
  size: number
  duration: number
  goproTelemetry: boolean
  width: number
  height: number
  framerate: number
  thumbnailData?: string
  needConversion: boolean
}

interface AddingVideo extends BasicVideoProps {
  status: "adding"

  size?: undefined
  duration?: undefined
  goproTelemetry?: undefined
  resolution?: undefined
  thumbnailData?: undefined
  needConversion?: undefined
}

interface ReadyVideo extends VideoProps {
  status: "ready"
}

export interface QueuedVideo extends VideoProps {
  status: "queued"
  convertedPath: string
}

export interface ConvertingVideo extends VideoProps {
  status: "converting"
  progress: number
  remainingTime?: number
  convertedPath: string
}

interface ConvertedVideo extends VideoProps {
  status: "converted"
  convertedSize: number
  convertedPath: string
}
interface NotReadyVideo extends VideoProps {
  status: "not-ready"
  error: string
}

export interface ConversionErrorVideo extends VideoProps {
  status: "conversion-error"
  error: string
  convertedPath: string
}

export type Video =
  | AddingVideo
  | ReadyVideo
  | QueuedVideo
  | ConvertingVideo
  | ConvertedVideo
  | NotReadyVideo
  | ConversionErrorVideo
