import React, {createContext, useContext, PropsWithChildren} from "react"
import {useDarkModeState} from "../hooks/internal/useDarkModeState"

type DarkModeContextType = {
  isDark: boolean
  toggleDark: () => void
  setDark: (dark: boolean) => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export function DarkModeProvider({
  children,
  enabled,
}: PropsWithChildren<{enabled: boolean}>) {
  const darkModeState = useDarkModeState(enabled)

  if (!enabled) {
    return <>{children}</>
  }

  return (
    <DarkModeContext.Provider value={darkModeState}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error(
      "useDarkMode must be used within a FlowProvider with enableDarkMode={true}"
    )
  }
  return context
} 