import {useEffect, useState} from "react"

export const useDarkModeState = (enabled: boolean) => {
  const [isDark, setIsDark] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Listen to system dark mode changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    
    // Initial state from media query
    setIsDark(mediaQuery.matches)
    setIsInitialized(true)

    // Only set up localStorage and override if explicitly enabled
    if (enabled) {
      const savedTheme = localStorage.getItem("flow-kit-theme")
      if (savedTheme) {
        setIsDark(savedTheme === "dark")
      }
    }

    // Listen for system changes
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if not explicitly enabled (following system)
      if (!enabled) {
        setIsDark(e.matches)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [enabled])

  // Save preference only when explicitly enabled
  useEffect(() => {
    if (!isInitialized) return
    
    // Only save to localStorage if explicitly enabled
    if (enabled) {
      localStorage.setItem("flow-kit-theme", isDark ? "dark" : "light")
    }
  }, [isDark, enabled, isInitialized])

  const toggleDark = () => setIsDark(!isDark)
  const setDark = (dark: boolean) => setIsDark(dark)

  return {isDark, toggleDark, setDark}
}
