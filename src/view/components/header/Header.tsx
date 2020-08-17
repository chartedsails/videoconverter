import { makeStyles, Typography } from "@material-ui/core"
import React from "react"
import clsx from "clsx"
import chartedSailsLogo from "~/assets/chartedsails-logo.svg"

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& img": {
      marginRight: theme.spacing(4),
    },
  },
}))

interface IProps {
  className?: string
}

export const Header = ({ className }: IProps) => {
  const classes = useStyles()
  return (
    <div className={clsx(classes.root, className)}>
      <img src={chartedSailsLogo} alt="ChartedSails logo" />
      <div>
        <Typography variant="h3">ChartedSails VideoConverter</Typography>
        <Typography>
          Quickly reduce file size - Keep GPS and telemetry data - Save time and
          disk space!
        </Typography>
      </div>
    </div>
  )
}
