import { action } from "@storybook/addon-actions"
import { storiesOf } from "@storybook/react"
import React, { useMemo, useState } from "react"
import { v4 } from "uuid"
import thumbnail from "~/assets/mock-thumbnail.jpg"
import { transcodingOptions } from "~/shared/TranscodingSetting"
import { Video } from "~/shared/Video"
import { AppContext, IAppContext } from "~/view/context/AppContext"
import { useScreenStory } from "~/view/theme/useScreenStory"
import { MainPanel } from "./MainPanel"

const stories = storiesOf("Components/MainPanel", module)

stories.add("No Videos", () => {
  useScreenStory()

  return <MainPanel />
})

const videos: Video[] = [
  {
    id: v4(),
    filepath: "/Users/thomas/Desktop/GOPRO45.MP4",
    status: "adding",
  },
  {
    id: v4(),
    status: "ready",
    filepath: "/Users/thomas/Desktop/GOPRO42.MP4",
    size: 3.223 * 1024 * 1024 * 1024,
    duration: 42 * 60 * 1000,
    thumbnailData: thumbnail,
    goproTelemetry: true,
    needConversion: false,
    width: 3840,
    height: 1800,
    framerate: 60,
  },
  {
    id: v4(),
    status: "not-ready",
    error: "File already exists",
    filepath: "/Users/thomas/Desktop/GOPRO43.MP4",
    duration: 65 * 60 * 1000 + 10,
    size: 382 * 1024 * 1024,
    thumbnailData: thumbnail,
    goproTelemetry: false,
    needConversion: false,
    width: 1920,
    height: 1200,
    framerate: 30,
  },
  {
    id: v4(),
    status: "queued",
    filepath: "/Users/thomas/Desktop/GOPRO46.MP4",
    convertedPath: "/Users/thomas/Desktop/GOPRO46.MP4",
    duration: 65 * 60 * 1000 + 10,
    size: 382 * 1024 * 1024,
    thumbnailData: thumbnail,
    goproTelemetry: false,
    needConversion: false,
    width: 1920,
    height: 1200,
    framerate: 30,
  },
  {
    id: v4(),
    status: "converting",
    filepath: "/Users/thomas/Desktop/GOPRO46.MP4",
    convertedPath: "/Users/thomas/Desktop/GOPRO46.MP4",
    duration: 65 * 60 * 1000 + 10,
    size: 382 * 1024 * 1024,
    thumbnailData: thumbnail,
    goproTelemetry: false,
    needConversion: false,
    width: 1920,
    height: 1200,
    framerate: 30,
    progress: 0.32,
  },
  {
    id: v4(),
    status: "converting",
    filepath: "/Users/thomas/Desktop/GOPRO46.MP4",
    convertedPath: "/Users/thomas/Desktop/GOPRO46.MP4",
    duration: 65 * 60 * 1000 + 10,
    size: 382 * 1024 * 1024,
    thumbnailData: thumbnail,
    goproTelemetry: false,
    needConversion: false,
    width: 1920,
    height: 1200,
    framerate: 30,
    progress: 0.84,
  },
  {
    id: v4(),
    status: "converted",
    filepath: "/Users/thomas/Desktop/GOPRO46.MP4",
    size: 1.223 * 1024 * 1024 * 1024,
    goproTelemetry: true,
    duration: 42000,
    width: 1920,
    height: 1200,
    framerate: 30,
    needConversion: false,
    convertedPath: "/Users/thomas/Movies/ChartedSails/GOPR046.MP4",
    convertedSize: 822 * 1024 * 1024,
  },
  {
    id: v4(),
    status: "conversion-error",
    error: "Out of disk space",
    filepath: "/Users/thomas/Desktop/GOPRO44.MP4",
    convertedPath: "/Users/thomas/Desktop/GOPRO46.MP4",
    size: 3.888 * 1024 * 1024 * 1024,
    duration: 420000,
    thumbnailData: thumbnail,
    goproTelemetry: true,
    needConversion: true,
    width: 1920,
    height: 1200,
    framerate: 30,
  },
  {
    id: v4(),
    status: "converted",
    filepath: "/Users/thomas/Desktop/GOPRO46.MP4",
    size: 1.223 * 1024 * 1024 * 1024,
    goproTelemetry: true,
    duration: 42000,
    width: 1920,
    height: 1200,
    framerate: 30,
    needConversion: false,
    convertedPath: "/Users/thomas/Movies/ChartedSails/GOPR046.MP4",
    convertedSize: 822 * 1024 * 1024,
  },
  {
    id: v4(),
    status: "converted",
    filepath: "/Users/thomas/Desktop/GOPRO46.MP4",
    size: 1.223 * 1024 * 1024 * 1024,
    goproTelemetry: true,
    duration: 42000,
    width: 1920,
    height: 1200,
    framerate: 30,
    needConversion: false,
    convertedPath: "/Users/thomas/Movies/ChartedSails/GOPR046.MP4",
    convertedSize: 822 * 1024 * 1024,
  },
]

stories.add("Bunch of different videos", () => {
  useScreenStory()

  const [transcoding, updateTranscoding] = useState(transcodingOptions[0])
  const context = useMemo<IAppContext>(
    () => ({
      videos,
      outputFolder: "/Users/thomas/Desktop/ChartedSails Videos",
      selectedTranscoding: transcoding,
      onTranscodingChange: updateTranscoding,
      addVideo: action("add video"),
      queueVideo: action("queue video"),
      removeVideo: action("remove video"),
      onOpenSelectFolderDialog: action("select folder"),
      openPath: action("open path"),
      openAbout: action("open about"),
      startDragging: action("start dragging"),
      error: undefined,
      clearError: () => true,
    }),
    [transcoding]
  )

  return (
    <AppContext.Provider value={context}>
      <MainPanel />
    </AppContext.Provider>
  )
})

stories.add("With error", () => {
  useScreenStory()

  const [transcoding, updateTranscoding] = useState(transcodingOptions[0])
  const [error, updateError] = useState<IAppContext["error"] | undefined>({
    title: "Video Error",
    filename: "GOPRO42.GPX",
    message: "This file is not a video.",
    details: "ffprobe: THIS IS NOT A VIDEO",
  })
  const context = useMemo<IAppContext>(
    () => ({
      videos,
      outputFolder: "/Users/thomas/Desktop/ChartedSails Videos",
      selectedTranscoding: transcoding,
      onTranscodingChange: updateTranscoding,
      addVideo: action("add video"),
      queueVideo: action("queue video"),
      removeVideo: action("remove video"),
      onOpenSelectFolderDialog: action("select folder"),
      openPath: action("open path"),
      openAbout: action("open about"),
      startDragging: action("start dragging"),
      error,
      clearError: () => updateError(undefined),
    }),
    [error, transcoding]
  )

  return (
    <AppContext.Provider value={context}>
      <MainPanel />
    </AppContext.Provider>
  )
})
