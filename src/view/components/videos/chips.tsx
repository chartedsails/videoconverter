import { Chip } from "@material-ui/core"
import ResolutionIcon from "@material-ui/icons/AspectRatio"
import ConversionNotNeededIcon from "@material-ui/icons/BeenhereTwoTone"
import ConversionNeededIcon from "@material-ui/icons/FitnessCenterTwoTone"
import GPSIcon from "@material-ui/icons/SatelliteTwoTone"
import React from "react"

export const TelemetryChip = ({ value }: { value: boolean }) => (
  <Chip
    color={value ? "primary" : "default"}
    label={value ? "Telemetry Available" : "No Telemetry"}
    icon={<GPSIcon />}
  />
)

export const ResolutionChip = ({
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

export const ConversionChip = ({ value }: { value: boolean }) => (
  <Chip
    color={value ? "secondary" : "default"}
    label={value ? "Conversion required" : "No conversion required"}
    icon={value ? <ConversionNeededIcon /> : <ConversionNotNeededIcon />}
  />
)
