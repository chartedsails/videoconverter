import { createContext, useContext } from "react"
import {
  transcodingOptions,
  TranscodingSetting,
} from "~/shared/TranscodingSetting"
import { Video } from "~/shared/Video"
import { AppError } from "~/shared/VideoConverterIPC"

export interface IAppContext {
  videos: Video[]
  addVideo: (filepath: string) => void
  queueVideo: (video: Video) => void

  outputFolder: string
  onOpenSelectFolderDialog: () => void

  selectedTranscoding: TranscodingSetting
  onTranscodingChange: (t: TranscodingSetting) => void

  openPath: (path: string) => void
  openAbout: () => void

  error?: AppError
  clearError: () => void
}

const noAppContext: IAppContext = {
  videos: [],
  addVideo: () => true,
  queueVideo: () => true,

  outputFolder: "My Videos/ChartedSails",
  onOpenSelectFolderDialog: () => true,

  selectedTranscoding: transcodingOptions[0],
  onTranscodingChange: () => true,

  openPath: () => true,
  openAbout: () => true,

  error: undefined,
  clearError: () => true,
}

export const AppContext = createContext<IAppContext>(noAppContext)

export const useAppContext = () => {
  return useContext(AppContext)
}
