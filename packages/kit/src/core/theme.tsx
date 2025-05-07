import React, {createContext, useContext} from "react"

export type ThemeColors = {
  primary: string
  secondary: string
  outline: string
}

export type Theme = {
  colors: ThemeColors
}

const defaultTheme: Theme = {
  colors: {
    primary: "bg-slate-900 text-white hover:bg-slate-800",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    outline:
      "bg-transparent border border-slate-200 text-slate-900 hover:bg-slate-100",
  },
}

const ThemeContext = createContext<Theme>(defaultTheme)
export const useTheme = () => useContext(ThemeContext)

type ThemeProviderProps = React.PropsWithChildren<{
  theme?: Partial<Theme>
}>

export const ThemeProvider = ({
  theme: customTheme,
  children,
}: ThemeProviderProps) => {
  const theme = {
    ...defaultTheme,
    ...customTheme,
    colors: {
      ...defaultTheme.colors,
      ...customTheme?.colors,
    },
  }
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}
