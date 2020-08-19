import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  makeStyles,
  Typography,
} from "@material-ui/core"
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline"
import React from "react"
import { AppError } from "~/shared/VideoConverterIPC"

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    display: "flex",
    alignItems: "center",
    "& svg": {
      marginRight: theme.spacing(2),
    },
  },
  error: {
    display: "flex",
    alignItems: "center",
  },
  details: {
    marginTop: theme.spacing(2),
  },
}))

interface IProps extends DialogProps {
  error?: AppError
}

export const ErrorDialog = ({ error, ...props }: IProps) => {
  const classes = useStyles()
  return (
    <Dialog maxWidth="md" fullWidth {...props}>
      <DialogTitle className={classes.title} disableTypography>
        <ErrorOutlineIcon fontSize={"large"} />
        <Typography variant="h4">{error?.title}</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">{error?.message}</Typography>
        {error?.details && (
          <Accordion className={classes.details}>
            <AccordionSummary>
              <Typography variant="h6">View details</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <pre>{error?.details}</pre>
            </AccordionDetails>
          </Accordion>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props?.onClose({}, "escapeKeyDown")}>OK</Button>
      </DialogActions>
    </Dialog>
  )
}
