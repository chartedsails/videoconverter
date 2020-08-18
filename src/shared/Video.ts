interface BasicVideoProps {
  id: string
  filepath: string
}

interface VideoProps extends BasicVideoProps {
  size: number
  duration: number
  goproTelemetry: boolean
  resolution: string
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

interface ConvertingVideo extends VideoProps {
  status: "converting"
  progress: number
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

interface ConversionErrorVideo extends VideoProps {
  status: "conversion-error"
  error: string
}

export type Video =
  | AddingVideo
  | ReadyVideo
  | ConvertingVideo
  | ConvertedVideo
  | NotReadyVideo
  | ConversionErrorVideo
