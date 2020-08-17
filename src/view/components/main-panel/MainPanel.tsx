import { makeStyles } from "@material-ui/core"
import React, { useCallback } from "react"
import clsx from "clsx"
import { Header } from "../header/Header"
import { Footer } from "../footer/Footer"
import { VideosContainer } from "../videos/VideosContainer"
import { useAppContext } from "~/view/context/AppContext"
import { useDropzone } from "react-dropzone"

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
  },
  header: {
    flexShrink: 0,
  },
  main: {
    flexGrow: 1,
    overflow: "auto",
    minHeight: "2em",
  },
  footer: {
    flexShrink: 0,
  },
}))

interface IProps {
  className?: string
}

export const MainPanel = ({ className }: IProps) => {
  const classes = useStyles()

  const { addVideo } = useAppContext()
  const handleDrop = useCallback(
    (files: File[]) => {
      for (const f of files) {
        addVideo(f.path)
      }
    },
    [addVideo]
  )
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
  })
  return (
    <div className={clsx(classes.root, className)} {...getRootProps()}>
      <input {...getInputProps()} />
      <Header className={classes.header} />
      <VideosContainer className={classes.main} />
      <Footer className={classes.footer} />
    </div>
  )
}
