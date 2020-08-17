// I know you think I stole this from somewhere on the Internet ...
// Got some inspiration from here:
// https://stackoverflow.com/questions/10623798/how-do-i-read-the-contents-of-a-node-js-stream-into-a-string-variable
// but mostly wrote this by myself :p

import stream from "stream"

export class Base64Stream extends stream.Writable {
  private chunks: any[]

  constructor() {
    super()
    this.chunks = []
  }

  _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    this.chunks.push(chunk)
    callback()
  }

  public getBase64Data(prefix?: string) {
    return (
      (prefix !== undefined ? prefix : "") +
      Buffer.concat(this.chunks).toString("base64")
    )
  }
}
