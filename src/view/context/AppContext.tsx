import { createContext, useContext } from "react"
import { Video } from "~/shared/Video"

export interface IAppContext {
  outputFolder: string
  videos: Video[]
  addVideo: (filepath: string) => void
}

const noAppContext: IAppContext = {
  videos: [],
  outputFolder: "My Videos/ChartedSails",
  addVideo: () => true,
}

export const AppContext = createContext<IAppContext>(noAppContext)

export const useAppContext = () => {
  return useContext(AppContext)
}
