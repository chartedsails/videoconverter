import React, { FC, useMemo, useState, useEffect, useCallback } from "react"
import { AppContext, IAppContext } from "./AppContext"
import { Video } from "~/shared/Video"
import { VideoConverterIPC } from "~/shared/VideoConverterIPC"

const ipcBridge = (window as any)
  .chartedSailsVideoConverter as VideoConverterIPC

export const IPCContextProvider: FC = ({ children }) => {
  const [videos, updateVideos] = useState<Video[]>([])

  const handleAddVideo = useCallback((filepath: string) => {
    ipcBridge.addVideo(filepath)
  }, [])

  const context = useMemo<IAppContext>(
    () => ({
      outputFolder: "",
      videos,
      addVideo: handleAddVideo,
    }),

    [videos, handleAddVideo]
  )
  const handleVideoUpdate = useCallback((video: Video) => {
    updateVideos((currentVideos) => {
      const index = currentVideos.findIndex((v) => v.id === video.id)
      if (index === -1) {
        return [...currentVideos, video]
      } else {
        const updated = [...currentVideos]
        updated[index] = video
        updateVideos(updated)
      }
    })
  }, [])
  useEffect(() => {
    ipcBridge.setVideoUpdatedListener(handleVideoUpdate)
  }, [handleVideoUpdate])
  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}
