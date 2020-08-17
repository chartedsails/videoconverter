import { makeStyles } from "@material-ui/core"
import clsx from "clsx"
import React from "react"
import { useAppContext } from "~/view/context/AppContext"
import { VideoPanel } from "./VideoPanel"

const useStyles = makeStyles(() => ({
  root: {
    position: "relative",
    overflow: "hidden",
  },
  scrollArea: {
    maxHeight: "100%",
  },
}))

interface IProps {
  className?: string
}

export const VideosContainer = ({ className }: IProps) => {
  const classes = useStyles()
  const { videos } = useAppContext()

  return (
    <div className={clsx(classes.root, className)}>
      <div className={classes.scrollArea}>
        {videos.map((v, i) => (
          <VideoPanel video={v} key={i} />
        ))}
      </div>
    </div>
  )
}
