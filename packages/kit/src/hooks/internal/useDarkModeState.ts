import {useEffect, useState} from "react"

export const useDarkModeState = (enabled: boolean) => {
  const [isDark, setIsDark] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize dark mode state
  useEffect(() => {
    if (!enabled || isInitialized) return

    const savedTheme = localStorage.getItem("flow-kit-theme")
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches

    const shouldBeDark = savedTheme ? savedTheme === "dark" : systemPrefersDark
    setIsDark(shouldBeDark)
    setIsInitialized(true)
  }, [enabled, isInitialized])

  // Apply dark class and save preference when isDark changes
  useEffect(() => {
    if (!enabled || !isInitialized) return

    // Apply dark class to document
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Save preference
    localStorage.setItem("flow-kit-theme", isDark ? "dark" : "light")
  }, [isDark, enabled, isInitialized])

  const toggleDark = () => setIsDark(!isDark)
  const setDark = (dark: boolean) => setIsDark(dark)

  return {isDark, toggleDark, setDark}
}
