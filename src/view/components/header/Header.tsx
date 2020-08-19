import { Button, makeStyles, Typography } from "@material-ui/core"
import clsx from "clsx"
import React from "react"
import chartedSailsLogo from "~/assets/chartedsails-logo.svg"
import { useAppContext } from "~/view/context/AppContext"

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& img": {
      marginRight: theme.spacing(4),
    },
  },
  aboutButton: {
    marginLeft: "auto",
  },
}))

interface IProps {
  className?: string
}

export const Header = ({ className }: IProps) => {
  const classes = useStyles()
  const { openAbout } = useAppContext()

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
      <Button
        className={classes.aboutButton}
        variant="text"
        onClick={openAbout}
      >
        About this app
      </Button>
    </div>
  )
}
