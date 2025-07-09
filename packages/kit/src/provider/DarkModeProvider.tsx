import React, {createContext, useContext, PropsWithChildren} from "react"

type DarkModeContextType = {
  isDark: boolean
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
)

export function DarkModeProvider({
  children,
  darkMode = false,
}: PropsWithChildren<{darkMode?: boolean}>) {
  return (
    <DarkModeContext.Provider value={{isDark: darkMode}}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error("useDarkMode must be used within a FlowProvider")
  }
  return context
}
