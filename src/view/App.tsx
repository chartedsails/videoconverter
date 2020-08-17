import React from "react"
import { MainPanel } from "./components/main-panel/MainPanel"
import { MuiThemeProvider, CssBaseline } from "@material-ui/core"
import { csVideoConverterTheme } from "./theme/theme"
import { IPCContextProvider } from "./context/IPCContextProvider"

export const App = () => {
  return (
    <MuiThemeProvider theme={csVideoConverterTheme}>
      <CssBaseline />
      <IPCContextProvider>
        <MainPanel />
      </IPCContextProvider>
    </MuiThemeProvider>
  )
}
