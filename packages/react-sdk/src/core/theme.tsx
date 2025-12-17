import React, {createContext, useContext} from "react"

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
  colors: ThemeColors
}

export type ButtonVariant = "primary" | "secondary" | "outline" | "link"

export type ButtonStyles = {
  background?: string
  text?: string
  hover?: string
  border?: string
  underline?: boolean
}

export const getButtonStyles = (
  colors: ThemeColors,
  variant: ButtonVariant
): ButtonStyles => {
  switch (variant) {
    case "primary":
      return {
        background: colors.primary,
        text: colors.primaryForeground,
        hover: colors.accent,
      }
    case "secondary":
      return {
        background: colors.secondary,
        text: colors.secondaryForeground,
        hover: colors.muted,
      }
    case "outline":
      return {
        background: "flow-bg-transparent",
        text: colors.foreground,
        hover: colors.muted,
        border: colors.border,
      }
    case "link":
      return {
        background: "flow-bg-transparent",
        text: colors.link,
        underline: true,
      }
    default:
      return {
        background: colors.primary,
        text: colors.primaryForeground,
        hover: colors.accent,
      }
  }
}

const defaultTheme: Theme = {
  colors: {
    primary: "flow-bg-slate-900",
    primaryForeground: "flow-text-white",
    secondary: "flow-bg-slate-100",
    secondaryForeground: "flow-text-slate-900",
    accent: "flow-bg-slate-800",
    background: "flow-bg-white",
    foreground: "flow-text-slate-900",
    muted: "flow-bg-slate-100",
    mutedForeground: "flow-text-slate-500",
    border: "flow-border-slate-200",
    success: "flow-text-green-600",
    error: "flow-text-red-600",
    link: "flow-text-slate-900",
  },
}

const ThemeContext = createContext<Theme>(defaultTheme)
export const useTheme = () => useContext(ThemeContext)

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

type ThemeProviderProps = React.PropsWithChildren<{
  theme?: DeepPartial<Theme>
}>

const deepMerge = <T extends object>(target: T, source?: DeepPartial<T>): T => {
  if (!source) return target
  const result = {...target}

  Object.keys(source).forEach(key => {
    const targetValue = target[key as keyof T]
    const sourceValue = source[key as keyof DeepPartial<T>]

    if (
      sourceValue &&
      typeof sourceValue === "object" &&
      targetValue &&
      typeof targetValue === "object"
    ) {
      result[key as keyof T] = deepMerge(
        targetValue as object,
        sourceValue as object
      ) as T[keyof T]
    } else if (sourceValue !== undefined) {
      result[key as keyof T] = sourceValue as T[keyof T]
    }
  })

  return result
}

export const ThemeProvider = ({
  theme: customTheme,
  children,
}: ThemeProviderProps) => {
  const theme = deepMerge(defaultTheme, customTheme)
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}
