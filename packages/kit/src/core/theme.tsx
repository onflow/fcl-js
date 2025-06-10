import React, {createContext, useContext} from "react"

export type ButtonVariant = {
  background: string
  text: string
  hover: string
  border?: string
}

export type ThemeColors = {
  primary: ButtonVariant
  secondary: ButtonVariant
  outline: ButtonVariant
  link: ButtonVariant
}

export type Theme = {
  colors: ThemeColors
}

const defaultTheme: Theme = {
  colors: {
    primary: {
      background: "bg-slate-900",
      text: "text-white",
      hover: "hover:bg-slate-800",
      border: undefined,
    },
    secondary: {
      background: "bg-slate-100",
      text: "text-slate-900",
      hover: "hover:bg-slate-200",
      border: undefined,
    },
    outline: {
      background: "bg-transparent",
      text: "text-slate-900",
      hover: "hover:bg-slate-100",
      border: "border border-slate-200",
    },
    link: {
      background: "bg-transparent",
      text: "text-slate-900",
      hover: "hover:underline",
      border: undefined,
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
