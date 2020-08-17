import { makeStyles, Paper, Typography } from "@material-ui/core"
import React from "react"
import clsx from "clsx"
import InfoIcon from "@material-ui/icons/InfoTwoTone"

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    padding: theme.spacing(3),
  },
}))

interface IProps {
  className?: string
}

export const Footer = ({ className }: IProps) => {
  const classes = useStyles()
  return (
    <Paper elevation={6} className={clsx(classes.root, className)}>
      <InfoIcon fontSize="large" />
      <Typography>
        Did you know? If you select the "Most Compatible" option on your GoPro
        or iPhone you will not need to convert videos before importing them.
      </Typography>
    </Paper>
  )
}
