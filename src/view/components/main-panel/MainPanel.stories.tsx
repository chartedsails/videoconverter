import { storiesOf } from "@storybook/react"
import React, { useMemo } from "react"
import { v4 } from "uuid"
import thumbnail from "~/assets/mock-thumbnail.jpg"
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
    filepath: "/Users/thomas/Desktop/GOPRO42.MP4",
    size: 3.223 * 1024 * 1024 * 1024,
    duration: 42 * 60 * 1000,
    thumbnailData: thumbnail,
    goproTelemetry: true,
    needConversion: false,
    resolution: "3840x1800",
  },
  {
    id: v4(),
    filepath: "/Users/thomas/Desktop/GOPRO43.MP4",
    duration: 65 * 60 * 1000 + 10,
    size: 382 * 1024 * 1024,
    thumbnailData: thumbnail,
    goproTelemetry: false,
    needConversion: false,
    resolution: "1900x1200",
  },
  {
    id: v4(),
    filepath: "/Users/thomas/Desktop/GOPRO44.MP4",
    size: 3.888 * 1024 * 1024 * 1024,
    thumbnailData: thumbnail,
    goproTelemetry: true,
    needConversion: true,
    resolution: "3840x1800",
  },
  {
    id: v4(),
    filepath: "/Users/thomas/Desktop/GOPRO45.MP4",
    size: 2.223 * 1024 * 1024 * 1024,
    resolution: "1900x1200",
  },
  {
    id: v4(),
    filepath: "/Users/thomas/Desktop/GOPRO46.MP4",
    size: 1.223 * 1024 * 1024 * 1024,
    resolution: "1900x1200",
    needConversion: false,
  },
  {
    id: v4(),
    filepath: "/Users/thomas/Desktop/GOPRO46.MP4",
    size: 1.223 * 1024 * 1024 * 1024,
    resolution: "1900x1200",
  },
  {
    id: v4(),
    filepath: "/Users/thomas/Desktop/GOPRO46.MP4",
    size: 1.223 * 1024 * 1024 * 1024,
  },
  {
    id: v4(),
    filepath: "/Users/thomas/Desktop/GOPRO46.MP4",
    size: 1.223 * 1024 * 1024 * 1024,
  },
  {
    id: v4(),
    filepath: "/Users/thomas/Desktop/GOPRO46.MP4",
    size: 1.223 * 1024 * 1024 * 1024,
  },
]

stories.add("Bunch of different videos", () => {
  useScreenStory()

  const context = useMemo<IAppContext>(
    () => ({
      videos,
      outputFolder: "/Users/thomas/Desktop/ChartedSails Videos",
      // eslint-disable-next-line no-console
      addVideo: (f) => console.log(`add file: `, f),
    }),
    []
  )

  return (
    <AppContext.Provider value={context}>
      <MainPanel />
    </AppContext.Provider>
  )
})
