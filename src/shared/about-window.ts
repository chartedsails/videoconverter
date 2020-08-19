import aboutWindow from "about-window"
import path from "path"
import logo from "~/assets/chartedsails-logo.png"

export const openVideoConverterAboutWindow = () => {
  aboutWindow({
    icon_path: path.join(__dirname, logo),
    product_name: "Action Video Converter",
    bug_report_url: "https://github.com/chartedsails/videoconverter/issues",
    homepage: "https://www.chartedsails.com/videoconverter",
    description:
      "Easily reduce size of action camera videos while keeping the telemetry. This application uses ffmpeg.",
  })
}
