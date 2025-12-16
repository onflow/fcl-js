import React, {createContext, useContext} from "react"

export type ColorPalette = {
  base: string // Base background color (e.g., "flow-bg-slate-900 dark:flow-bg-slate-100")
  text: string // Text color when used on base (e.g., "flow-text-white dark:flow-text-slate-900")
  hover: string // Hover variant (e.g., "hover:flow-bg-slate-800 dark:hover:flow-bg-slate-200")
  muted: string // Muted/lighter variant (e.g., "flow-bg-slate-100 dark:flow-bg-slate-800")
  mutedText: string // Text color for muted variant
  mutedHover: string // Hover for muted variant
  border: string // Border color (e.g., "flow-border-slate-200 dark:flow-border-slate-700")
}

export type ThemeColors = {
  primary: ColorPalette
  secondary: ColorPalette
  tertiary: ColorPalette
}

export type Theme = {
  colors: ThemeColors
}

export type ButtonVariant = "primary" | "secondary" | "outline" | "link"

export const getButtonStyles = (colors: ThemeColors, variant: ButtonVariant) => {
  const {primary} = colors

  switch (variant) {
    case "primary":
      return {
        background: primary.base,
        text: primary.text,
        hover: primary.hover,
        border: undefined,
      }
    case "secondary":
      return {
        background: primary.muted,
        text: primary.mutedText,
        hover: primary.mutedHover,
        border: undefined,
      }
    case "outline":
      return {
        background: "flow-bg-transparent",
        text: primary.mutedText,
        hover: primary.mutedHover,
        border: `flow-border ${primary.border}`,
      }
    case "link":
      return {
        background: "flow-bg-transparent",
        text: primary.mutedText,
        hover: "hover:flow-underline",
        border: undefined,
      }
    default:
      return {
        background: primary.base,
        text: primary.text,
        hover: primary.hover,
        border: undefined,
      }
  }
}

const defaultTheme: Theme = {
  colors: {
    primary: {
      base: "flow-bg-slate-900 dark:flow-bg-slate-100",
      text: "flow-text-white dark:flow-text-slate-900",
      hover: "hover:flow-bg-slate-800 dark:hover:flow-bg-slate-200",
      muted: "flow-bg-slate-100 dark:flow-bg-slate-800",
      mutedText: "flow-text-slate-900 dark:flow-text-slate-100",
      mutedHover: "hover:flow-bg-slate-200 dark:hover:flow-bg-slate-700",
      border: "flow-border-slate-200 dark:flow-border-slate-700",
    },
    secondary: {
      base: "flow-bg-slate-600 dark:flow-bg-slate-400",
      text: "flow-text-white dark:flow-text-slate-900",
      hover: "hover:flow-bg-slate-500 dark:hover:flow-bg-slate-300",
      muted: "flow-bg-slate-50 dark:flow-bg-slate-900",
      mutedText: "flow-text-slate-700 dark:flow-text-slate-300",
      mutedHover: "hover:flow-bg-slate-100 dark:hover:flow-bg-slate-800",
      border: "flow-border-slate-300 dark:flow-border-slate-600",
    },
    tertiary: {
      base: "flow-bg-slate-400 dark:flow-bg-slate-600",
      text: "flow-text-white dark:flow-text-slate-100",
      hover: "hover:flow-bg-slate-300 dark:hover:flow-bg-slate-500",
      muted: "flow-bg-slate-50 dark:flow-bg-slate-900",
      mutedText: "flow-text-slate-600 dark:flow-text-slate-400",
      mutedHover: "hover:flow-bg-slate-100 dark:hover:flow-bg-slate-800",
      border: "flow-border-slate-400 dark:flow-border-slate-500",
    },
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
