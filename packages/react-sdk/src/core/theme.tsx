import React, {createContext, useContext} from "react"

/**
 * Semantic color tokens for theming Flow SDK components.
 * Each token accepts Tailwind class(es) (e.g., "flow-bg-blue-600 dark:flow-bg-blue-500")
 */
export type ThemeColors = {
  /** Primary action color (CTAs, main buttons) */
  primary?: string
  /** Text color on primary backgrounds */
  primaryForeground?: string
  /** Secondary action color (secondary buttons) */
  secondary?: string
  /** Text color on secondary backgrounds */
  secondaryForeground?: string
  /** Accent color for highlights, selected states */
  accent?: string
  /** Default background color (cards, modals) */
  background?: string
  /** Default text color */
  foreground?: string
  /** Muted/subtle background color */
  muted?: string
  /** Muted text color */
  mutedForeground?: string
  /** Border color */
  border?: string
  /** Success state color */
  success?: string
  /** Error state color */
  error?: string
  /** Link text color */
  link?: string
}

export type Theme = {
  colors?: ThemeColors
}

const defaultColors: Required<ThemeColors> = {
  primary: "flow-bg-slate-900 dark:flow-bg-slate-100",
  primaryForeground: "flow-text-white dark:flow-text-slate-900",
  secondary: "flow-bg-slate-100 dark:flow-bg-slate-800",
  secondaryForeground: "flow-text-slate-900 dark:flow-text-slate-100",
  accent: "flow-bg-blue-500",
  background: "flow-bg-white dark:flow-bg-slate-900",
  foreground: "flow-text-slate-900 dark:flow-text-slate-100",
  muted: "flow-bg-slate-100 dark:flow-bg-slate-800",
  mutedForeground: "flow-text-slate-500 dark:flow-text-slate-400",
  border: "flow-border-slate-200 dark:flow-border-slate-700",
  success: "flow-text-green-500",
  error: "flow-text-red-500",
  link: "flow-text-blue-600 dark:flow-text-blue-400",
}

type InternalTheme = {
  colors: Required<ThemeColors>
}

const defaultTheme: InternalTheme = {
  colors: defaultColors,
}

const ThemeContext = createContext<InternalTheme>(defaultTheme)
export const useTheme = () => useContext(ThemeContext)

type ThemeProviderProps = React.PropsWithChildren<{
  theme?: Theme
}>

export const ThemeProvider = ({
  theme: customTheme,
  children,
}: ThemeProviderProps) => {
  const theme: InternalTheme = {
    colors: {
      ...defaultColors,
      ...customTheme?.colors,
    },
  }
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}
