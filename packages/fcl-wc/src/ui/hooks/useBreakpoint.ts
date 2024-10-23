import {useEffect, useState} from "preact/hooks"

export function useBreakpoint(breakpoint: number) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`)
    const listener = () => setMatches(mediaQuery.matches)

    mediaQuery.addEventListener("change", listener)
    listener()

    return () => mediaQuery.removeEventListener("change", listener)
  }, [breakpoint])

  return matches
}
