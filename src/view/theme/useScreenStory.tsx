import { useEffect } from "react"

export const useScreenStory = () => {
  useEffect(() => {
    ;(document.body.style as any) = ""
  }, [])
}
