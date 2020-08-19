# Action Video Converter

A simple tool to resize and convert videos from action cameras (mostly GoPro,
Garmin Virb and DJI drones).

I created this tool because I needed a simple tool for
[chartedsails.com](https://www.chartedsails.com) users to resize their videos
and convert HEVC (H265) videos to a format compatible with the browser.

## How does it work?

- Download and install Action Video Converter (works on MacOS and Windows - Linux should work too if you want to help testing)
- Open the program
- Drag and drop video files
- Select the size you want to resize to (1080p, 720p or 480p)
- Click 'Convert'
- That's it!

## Cookies and all

This program does not collect any information from your computer - It's
completely tracker free!

## Download

You can download the latest version of this program from our [releases
page](https://github.com/chartedsails/videoconverter/releases/latest).

## Bugs and Contributions

Please use our [issue
tracker](https://github.com/chartedsails/videoconverter/issues) to report
bugs. We gladly accept pull-requests for bug fixes and new features.

## Thank you

This program makes heavy use of ffmpeg and would not be possible without it.

We automatically bundle ffmpeg using
[ffmpeg-installer](https://github.com/kribblo/node-ffmpeg-installer#readme).

Ffmpeg binaries are downloaded from the sources listed at ffmpeg.org:

- Linux 32-bit: (20181210-g0e8eb07980): https://www.johnvansickle.com/ffmpeg/
- Linux 64-bit: (20181210-g0e8eb07980): https://www.johnvansickle.com/ffmpeg/
- Mac OS/X (92718-g092cb17983): https://evermeet.cx/ffmpeg/
- Windows 32-bit (20181217-f22fcd4): https://ffmpeg.zeranoe.com/builds/win32/static/
- Windows 64-bit (20181217-f22fcd4): https://ffmpeg.zeranoe.com/builds/win64/static/

## License

Copyright ChartedSails LLC - Thomas Sarlandie, 2020.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
