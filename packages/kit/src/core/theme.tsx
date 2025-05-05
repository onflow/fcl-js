import React, {createContext, useContext} from "react"

export type ThemeColors = {
  primary: string // e.g. "bg-blue-600 text-white hover:bg-blue-700"
  secondary: string // e.g. "bg-gray-500 text-white hover:bg-gray-600"
  background: string // e.g. "bg-white dark:bg-slate-900"
  text: string // e.g. "text-slate-900 dark:text-slate-100"
  border: string // e.g. "border-gray-200 dark:border-slate-700"
}

export type Theme = {
  colors: ThemeColors
}

const defaultTheme: Theme = {
  colors: {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    background: "bg-white dark:bg-slate-900",
    text: "text-slate-900 dark:text-slate-100",
    border: "border-gray-200 dark:border-slate-700",
  },
}

const ThemeContext = createContext<Theme>(defaultTheme)

export const useTheme = () => useContext(ThemeContext)

type ThemeProviderProps = React.PropsWithChildren<{
  theme?: Partial<Theme>
}>

export const ThemeProvider = ({ theme: customTheme, children }: ThemeProviderProps) => {
  const theme = {
    ...defaultTheme,
    ...customTheme,
    colors: {
      ...defaultTheme.colors,
      ...customTheme?.colors,
    },
  }
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
} 