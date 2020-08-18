import { createContext, useContext } from "react"
import {
  transcodingOptions,
  TranscodingSetting,
} from "~/shared/TranscodingSetting"
import { Video } from "~/shared/Video"

export interface IAppContext {
  videos: Video[]
  addVideo: (filepath: string) => void

  outputFolder: string
  onOpenSelectFolderDialog: () => void

  selectedTranscoding: TranscodingSetting
  onTranscodingChange: (t: TranscodingSetting) => void
}

const noAppContext: IAppContext = {
  videos: [],
  addVideo: () => true,

  outputFolder: "My Videos/ChartedSails",
  onOpenSelectFolderDialog: () => true,

  selectedTranscoding: transcodingOptions[0],
  onTranscodingChange: () => true,
}

export const AppContext = createContext<IAppContext>(noAppContext)

export const useAppContext = () => {
  return useContext(AppContext)
}
