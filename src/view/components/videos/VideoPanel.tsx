import {
  Chip,
  CircularProgress,
  Fab,
  LinearProgress,
  makeStyles,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core"
import ResolutionIcon from "@material-ui/icons/AspectRatio"
import ConversionNotNeededIcon from "@material-ui/icons/BeenhereTwoTone"
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline"
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline"
import ConversionNeededIcon from "@material-ui/icons/FitnessCenterTwoTone"
import ImageMissing from "@material-ui/icons/ImageTwoTone"
import GPSIcon from "@material-ui/icons/SatelliteTwoTone"
import SlowMotionVideoIcon from "@material-ui/icons/SlowMotionVideo"
import clsx from "clsx"
import React from "react"
import { Video } from "~/shared/Video"
import { formatChrono } from "~/util/format-duration"
import { formatBytes } from "~/util/format-size"

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    display: "flex",
    padding: theme.spacing(2),
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
}))

interface IProps {
  className?: string
  video: Video
  onConvertClick?: () => void
  onOpenConvertedVideo?: () => void
  onOpenOriginalVideo?: () => void
}

const TelemetryChip = ({ value }: { value: boolean }) => (
  <Chip
    color={value ? "primary" : "default"}
    label={value ? "Telemetry Available" : "No Telemetry"}
    icon={<GPSIcon />}
  />
)
const ResolutionChip = ({
  width,
  height,
  framerate,
}: {
  width: number
  height: number
  framerate: number
}) => (
  <Chip
    color="primary"
    label={`${width}x${height}@${framerate}`}
    icon={<ResolutionIcon />}
  />
)
const ConversionChip = ({ value }: { value: boolean }) => (
  <Chip
    color={value ? "secondary" : "default"}
    label={value ? "Conversion required" : "No conversion required"}
    icon={value ? <ConversionNeededIcon /> : <ConversionNotNeededIcon />}
  />
)

export const VideoPanel = ({
  className,
  video,
  onConvertClick,
  onOpenConvertedVideo,
  onOpenOriginalVideo,
}: IProps) => {
  const classes = useStyles()

  const basename = video.filepath.split("/").pop()

  return (
    <Paper elevation={2} className={clsx(classes.root, className)}>
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
            {video.remainingTime !== undefined && (
              <Typography>{formatChrono(video.remainingTime)}</Typography>
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
    </Paper>
  )
}
