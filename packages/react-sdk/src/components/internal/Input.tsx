import React from "react"
import {useDarkMode} from "../../provider/DarkModeProvider"
import {twMerge} from "tailwind-merge"

export interface InputProps extends React.ComponentProps<"input"> {}

export const Input: React.FC<InputProps> = ({className, ...props}) => {
  const {isDark} = useDarkMode()
  return (
    <input
      className={twMerge(
        "flow-w-full flow-px-4 flow-py-2 flow-rounded-md flow-border",
        "flow-bg-white dark:flow-bg-slate-800",
        "flow-text-slate-900 dark:flow-text-slate-100",
        "flow-border-slate-300 dark:flow-border-slate-600",
        "focus:flow-outline-none focus:flow-ring-2 focus:flow-ring-flow-primary/50",
        "focus:flow-border-flow-primary",
        "placeholder:flow-text-slate-400 dark:placeholder:flow-text-slate-500",
        className
      )}
      {...props}
    />
  )
}
