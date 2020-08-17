import { createMuiTheme } from "@material-ui/core"

export const csVideoConverterTheme = createMuiTheme({
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
