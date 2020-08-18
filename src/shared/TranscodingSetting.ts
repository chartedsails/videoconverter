export interface TranscodingSetting {
  name: string
  maxLines: number
}

export const transcodingOptions: TranscodingSetting[] = [
  { name: "1080p (High)", maxLines: 1080 },
  { name: "720p (Medium)", maxLines: 720 },
  { name: "480p (Low)", maxLines: 480 },
]
