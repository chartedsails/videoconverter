import { mockVideoPath } from "~/__mocks/mock-videos"
import { extractBase64Thumbnail } from "./extract-thumbnail"

describe("extracting thumbnail", () => {
  it("can extract a thumbnail from a video", async () => {
    const b64 = await extractBase64Thumbnail(mockVideoPath("h264.mp4"))
    expect(b64).toMatch("data:image/jpeg;base64")
  })
})
