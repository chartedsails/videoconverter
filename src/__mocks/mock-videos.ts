import path from "path"

export const mockVideoPath = (name: string) => {
  return path.join(__dirname, "../../mockvideos", name)
}
