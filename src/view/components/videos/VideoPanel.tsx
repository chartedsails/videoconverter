import { makeStyles, Paper, Typography, Chip } from "@material-ui/core"
import React from "react"
import clsx from "clsx"
import ImageMissing from "@material-ui/icons/ImageTwoTone"
import GPSIcon from "@material-ui/icons/SatelliteTwoTone"
import ResolutionIcon from "@material-ui/icons/AspectRatio"
import ConversionNotNeededIcon from "@material-ui/icons/BeenhereTwoTone"
import ConversionNeededIcon from "@material-ui/icons/FitnessCenterTwoTone"
import { Video } from "~/shared/Video"

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
}))

interface IProps {
  className?: string
  video: Video
}

const TelemetryChip = ({ value }: { value: boolean }) => (
  <Chip
    color={value ? "primary" : "default"}
    label={value ? "Telemetry Available" : "No Telemetry"}
    icon={<GPSIcon />}
  />
)
const ResolutionChip = ({ value }: { value: string }) => (
  <Chip color="primary" label={value} icon={<ResolutionIcon />} />
)
const ConversionChip = ({ value }: { value: boolean }) => (
  <Chip
    color={value ? "secondary" : "default"}
    label={value ? "Conversion required" : "No conversion required"}
    icon={value ? <ConversionNeededIcon /> : <ConversionNotNeededIcon />}
  />
)

export const VideoPanel = ({ className, video }: IProps) => {
  const classes = useStyles()

  const basename = video.filepath.split("/").pop()

  return (
    <Paper elevation={2} className={clsx(classes.root, className)}>
      <div className={classes.thumbnail}>
        {video.thumbnailData ? (
          <img src={video.thumbnailData} alt={basename} />
        ) : (
          <ImageMissing />
        )}
      </div>
      <div className={classes.details}>
        <Typography>
          {basename} - {video.size}
        </Typography>
        <div className={classes.badges}>
          {video.goproTelemetry !== undefined && (
            <TelemetryChip value={video.goproTelemetry} />
          )}
          {video.resolution !== undefined && (
            <ResolutionChip value={video.resolution} />
          )}
          {video.needConversion !== undefined && (
            <ConversionChip value={video.needConversion} />
          )}
        </div>
      </div>
    </Paper>
  )
}