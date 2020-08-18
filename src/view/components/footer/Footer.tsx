import { makeStyles, Paper, Typography } from "@material-ui/core"
import InfoIcon from "@material-ui/icons/InfoTwoTone"
import clsx from "clsx"
import React from "react"

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(4),
  },
  icon: { marginRight: theme.spacing(2) },
}))

interface IProps {
  className?: string
}

export const Footer = ({ className }: IProps) => {
  const classes = useStyles()
  return (
    <Paper elevation={6} className={clsx(classes.root, className)} square>
      <InfoIcon fontSize="large" className={classes.icon} />
      <Typography>
        Did you know? If you select the "Most Compatible" option on your GoPro
        or iPhone you will not need to convert videos before importing them.
      </Typography>
    </Paper>
  )
}
