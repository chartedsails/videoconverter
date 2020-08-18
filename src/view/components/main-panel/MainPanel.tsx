import { makeStyles, Paper } from "@material-ui/core"
import clsx from "clsx"
import React, { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { useAppContext } from "~/view/context/AppContext"
import { Footer } from "../footer/Footer"
import { Header } from "../header/Header"
import { Settings } from "../header/Settings"
import { VideosContainer } from "../videos/VideosContainer"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
  },
  header: {
    padding: theme.spacing(2),
    flexShrink: 0,
  },
  titleBlock: {
    marginBottom: theme.spacing(2),
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
    noClick: true,
    noKeyboard: true,
  })
  return (
    <div className={clsx(classes.root, className)} {...getRootProps()}>
      <input {...getInputProps()} />
      <Paper className={classes.header} square>
        <Header className={classes.titleBlock} />
        <Settings />
      </Paper>
      <VideosContainer className={classes.main} />
      <Footer className={classes.footer} />
    </div>
  )
}
