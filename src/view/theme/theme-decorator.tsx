import { MuiThemeProvider, CssBaseline } from "@material-ui/core"
import React from "react"
import { csVideoConverterTheme } from "./theme"

export const CSThemeDecorator: (story: any) => any = (story) => (
  <MuiThemeProvider theme={csVideoConverterTheme}>
    <CssBaseline />
    {story()}
  </MuiThemeProvider>
)
