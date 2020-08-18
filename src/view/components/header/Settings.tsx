import {
  FormControl,
  InputAdornment,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core"
import FolderOpenIcon from "@material-ui/icons/FolderOpen"
import clsx from "clsx"
import React, { useCallback } from "react"
import { transcodingOptions } from "~/shared/TranscodingSetting"
import { useAppContext } from "~/view/context/AppContext"

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  right: {
    marginLeft: "auto",
  },
}))

interface IProps {
  className?: string
}

export const Settings = ({ className }: IProps) => {
  const classes = useStyles()

  const {
    outputFolder,
    selectedTranscoding,
    onOpenSelectFolderDialog,
    onTranscodingChange,
  } = useAppContext()

  const handleChange = useCallback(
    (e) => {
      const name = e.target.value
      const t = transcodingOptions.find((o) => o.name === name)
      onTranscodingChange(t)
    },
    [onTranscodingChange]
  )

  return (
    <div className={clsx(classes.root, className)}>
      <FormControl>
        <InputLabel id="settings-select-label">Quality</InputLabel>
        <Select
          labelId="settings-select-label"
          value={selectedTranscoding.name}
          onChange={handleChange}
        >
          {transcodingOptions.map((t, i) => (
            <MenuItem key={i} value={t.name}>
              {t.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        className={classes.right}
        label="Folder"
        onClick={onOpenSelectFolderDialog}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FolderOpenIcon />
            </InputAdornment>
          ),
        }}
        value={outputFolder}
      />
    </div>
  )
}
