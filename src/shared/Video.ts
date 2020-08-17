export interface Video {
  id: string
  filepath: string
  size: number
  duration?: number
  goproTelemetry?: boolean
  resolution?: string
  thumbnailData?: string
  needConversion?: boolean
}
