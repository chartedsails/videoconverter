import React, { FC, useCallback, useEffect, useMemo, useState } from "react"
import {
  transcodingOptions,
  TranscodingSetting,
} from "~/shared/TranscodingSetting"
import { Video } from "~/shared/Video"
import { VideoConverterIPC } from "~/shared/VideoConverterIPC"
import { AppContext, IAppContext } from "./AppContext"

const ipcBridge = (window as any)
  .chartedSailsVideoConverter as VideoConverterIPC

export const IPCContextProvider: FC = ({ children }) => {
  // The source of truth is always the app. We useState to keep the latest value sent by the app.
  const handleAddVideo = useCallback((filepath: string) => {
    ipcBridge.addVideo(filepath)
  }, [])
  const handleSelectOutputFolder = useCallback(() => {
    ipcBridge.selectOutputFolder()
  }, [])
  const handleTranscodingChange = useCallback((t: TranscodingSetting) => {
    ipcBridge.selectTranscoding(t)
  }, [])
  const handleQueueVideo = useCallback((v: Video) => {
    ipcBridge.queueVideo(v)
  }, [])
  const handleOpenPath = useCallback((path: string) => {
    ipcBridge.openPath(path)
  }, [])

  const [videos, updateVideos] = useState<Video[]>([])
  const [selectedTranscoding, updateSelectedTranscoding] = useState(
    transcodingOptions[0]
  )
  const [outputFolder, updateOutputFolder] = useState("")

  const context = useMemo<IAppContext>(
    () => ({
      outputFolder,
      videos,
      addVideo: handleAddVideo,
      queueVideo: handleQueueVideo,
      onOpenSelectFolderDialog: handleSelectOutputFolder,
      onTranscodingChange: handleTranscodingChange,
      selectedTranscoding: selectedTranscoding,
      openPath: handleOpenPath,
    }),

    [
      outputFolder,
      videos,
      handleAddVideo,
      handleQueueVideo,
      handleSelectOutputFolder,
      handleTranscodingChange,
      selectedTranscoding,
      handleOpenPath,
    ]
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

  const handleSettingsChange = useCallback(
    (t: TranscodingSetting, f: string) => {
      updateSelectedTranscoding(t)
      updateOutputFolder(f)
    },
    []
  )

  useEffect(() => {
    ipcBridge.setVideoUpdatedListener(handleVideoUpdate)
    ipcBridge.setSettingsChangeListener(handleSettingsChange)
    ipcBridge.getSettings()
    ipcBridge.refreshAllVideos()
  }, [handleSettingsChange, handleVideoUpdate])
  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}
