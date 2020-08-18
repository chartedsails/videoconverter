import { v4 } from "uuid"
import { mockVideoPath } from "~/__mocks/mock-videos"
import { getVideoInfo } from "./video-info"

const getInfo = (mock: string) => {
  return getVideoInfo({
    id: v4(),
    filepath: mockVideoPath(mock),
    status: "adding",
  })
}

describe("it can extract video info", () => {
  it("fails if the file does not exist", (done) => {
    getInfo("/filedoesnotexist.mp4")
      .then(() => {
        throw new Error("createVideoInfo successfully returned something")
      })
      .catch((error) => {
        expect(error.message).toMatch(/no such file/)
        done()
      })
  })

  it("can extract the duration and codec from a h264 file", async () => {
    const v = await getInfo("h264.mp4")
    expect(v.needConversion).toBe(false)
    expect(v.duration).toBeCloseTo(1001)
  })

  it("can extract the duration and codec from a h265 file", async () => {
    const v = await getInfo("h265.mp4")
    expect(v.needConversion).toBe(true)
    expect(v.duration).toBeCloseTo(1001)
  })

  it("can detect gopro track in video file", async () => {
    const v = await getInfo("gpmd.mp4")
    expect(v.goproTelemetry).toBe(true)
  })
})
