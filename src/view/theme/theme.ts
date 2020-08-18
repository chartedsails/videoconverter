import { createMuiTheme } from "@material-ui/core"

export const csBlue = "#176CDF" // used to be "#137CE6"
export const csBlueLight = "#2F80ED"
export const csOrange = "#fb7a00" // chroma([251, 122, 0]).hex()
export const csRed = "#e62a10" //chroma([230, 42, 16]).hex()
export const textDefaultColor = "#252525"
export const textColorGrey = "#757575"
export const csBackgroundGrey1 = "#EEF5F5"
export const csButtonGrey = "#E0E0E0"

export const csVideoConverterTheme = createMuiTheme({
  palette: {
    primary: { main: csBlue, light: "#2F80ED" },
    secondary: { main: csOrange, contrastText: "#fff" },
    text: {
      primary: textDefaultColor,
      secondary: textColorGrey,
    },
    background: {
      default: "#fff",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "::-webkit-scrollbar": {
          appearance: "none",
          width: 7,
        },
        "::-webkit-scrollbar-thumb": {
          borderRadius: 4,
          backgroundColor: "rgba(0, 0, 0, .5)",
          boxShadow: "0 0 1px rgba(255, 255, 255, .5)",
        },
      },
    },
  },
})
