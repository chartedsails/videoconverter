import {
  CircularProgress,
  Fab,
  Fade,
  IconButton,
  LinearProgress,
  makeStyles,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core"
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline"
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline"
import HighlightOffIcon from "@material-ui/icons/HighlightOff"
import ImageMissing from "@material-ui/icons/ImageTwoTone"
import SlowMotionVideoIcon from "@material-ui/icons/SlowMotionVideo"
import clsx from "clsx"
import React, { useState } from "react"
import { Video } from "~/shared/Video"
import { formatChrono } from "~/util/format-duration"
import { formatBytes } from "~/util/format-size"
import { ConversionChip, ResolutionChip, TelemetryChip } from "./chips"

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    display: "flex",
    padding: theme.spacing(2),
    position: "relative",
  },
  thumbnail: {
    width: 100,
    textAlign: "center",
    alignSelf: "center",
    "& img": {
      maxWidth: "100%",
      boxShadow: theme.shadows[6],
    },
    marginRight: theme.spacing(2),
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  badges: {
    "& .MuiChip-root": {
      marginRight: theme.spacing(1),
    },
  },
  result: {
    marginLeft: "auto",
    width: 200,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  remove: {
    flexShrink: 0,
    marginTop: "auto",
    marginBottom: "auto",
  },
}))

interface IProps {
  className?: string
  video: Video
  onConvertClick?: () => void
  onOpenConvertedVideo?: () => void
  onOpenOriginalVideo?: () => void
  onRemove?: () => void
  onDragStart?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent) => void
}

export const VideoPanel = ({
  className,
  video,
  onConvertClick,
  onOpenConvertedVideo,
  onOpenOriginalVideo,
  onRemove,
  onDragStart,
  onDrop,
}: IProps) => {
  const classes = useStyles()

  const basename = video.filepath.split("/").pop()

  const [isHovering, updateIsHovering] = useState(false)

  return (
    <Paper
      elevation={2}
      className={clsx(classes.root, className)}
      onMouseEnter={() => updateIsHovering(true)}
      onMouseLeave={() => updateIsHovering(false)}
      onDragStart={onDragStart}
      onDrop={onDrop}
      draggable
    >
      <div className={classes.thumbnail}>
        {video.thumbnailData ? (
          <img
            src={video.thumbnailData}
            alt={basename}
            onDoubleClick={onOpenOriginalVideo}
          />
        ) : (
          <ImageMissing />
        )}
      </div>
      <div className={classes.details}>
        <Typography>
          {basename}
          {video.status !== "adding" && (
            <>
              {" "}
              - {formatChrono(video.duration)} - {formatBytes(video.size)}
            </>
          )}
        </Typography>
        <div className={classes.badges}>
          {video.goproTelemetry !== undefined && (
            <TelemetryChip value={video.goproTelemetry} />
          )}
          {video.status !== "adding" && <ResolutionChip {...video} />}
          {video.needConversion !== undefined && (
            <ConversionChip value={video.needConversion} />
          )}
        </div>
      </div>
      <div className={classes.result} onDoubleClick={onOpenConvertedVideo}>
        {video.status === "ready" && (
          <Fab variant="extended" color="primary" onClick={onConvertClick}>
            <SlowMotionVideoIcon />
            Convert Video
          </Fab>
        )}
        {video.status === "not-ready" && (
          <Tooltip title={video.error}>
            <span>
              <Fab variant="extended" disabled>
                <SlowMotionVideoIcon />
                Convert Video
              </Fab>
            </span>
          </Tooltip>
        )}
        {video.status === "queued" && (
          <>
            <CircularProgress />
          </>
        )}
        {video.status === "converting" && (
          <>
            <LinearProgress
              value={video.progress * 100}
              variant="determinate"
              color="primary"
              style={{ width: 64 }}
            />
            {video.remainingTime !== undefined ? (
              <Typography>{formatChrono(video.remainingTime)}</Typography>
            ) : (
              <Typography>Estimating...</Typography>
            )}
          </>
        )}
        {video.status === "conversion-error" && (
          <>
            <ErrorOutlineIcon color="error" />
            <Typography color="error">{video.error}</Typography>
          </>
        )}
        {video.status === "converted" && (
          <>
            <CheckCircleOutlineIcon color="primary" />
            <Typography>{formatBytes(video.convertedSize)}</Typography>
          </>
        )}
      </div>
      <Fade in={isHovering}>
        <IconButton onClick={onRemove} className={classes.remove}>
          <HighlightOffIcon />
        </IconButton>
      </Fade>
    </Paper>
  )
}
