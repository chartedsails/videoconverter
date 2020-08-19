import React, { FC, useCallback, useEffect, useMemo, useState } from "react"
import {
  transcodingOptions,
  TranscodingSetting,
} from "~/shared/TranscodingSetting"
import { Video } from "~/shared/Video"
import { AppError, VideoConverterIPC } from "~/shared/VideoConverterIPC"
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
  const handleOpenAbout = useCallback(() => ipcBridge.openAbout(), [])

  const [videos, updateVideos] = useState<Video[]>([])
  const [selectedTranscoding, updateSelectedTranscoding] = useState(
    transcodingOptions[0]
  )
  const [outputFolder, updateOutputFolder] = useState("")
  const [error, updateError] = useState<IAppContext["error"]>()

  const handleClearError = useCallback(() => updateError(undefined), [])

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
      openAbout: handleOpenAbout,
      clearError: handleClearError,
      error,
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
      handleOpenAbout,
      handleClearError,
      error,
    ]
  )
  const handleVideosUpdate = useCallback((videos: Video[]) => {
    updateVideos(videos)
  }, [])

  const handleSettingsChange = useCallback(
    (t: TranscodingSetting, f: string) => {
      updateSelectedTranscoding(t)
      updateOutputFolder(f)
    },
    []
  )

  const handleError = useCallback((error: AppError) => updateError(error), [])

  useEffect(() => {
    ipcBridge.setVideosUpdatedListener(handleVideosUpdate)
    ipcBridge.setSettingsChangeListener(handleSettingsChange)
    ipcBridge.setErrorListener(handleError)
    ipcBridge.getSettings()
    ipcBridge.refreshAllVideos()
  }, [handleError, handleSettingsChange, handleVideosUpdate])
  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}
