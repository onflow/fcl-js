import React from "react"
import {Button as HeadlessButton} from "@headlessui/react"
import {useTheme} from "../../core/theme"
import {twMerge} from "tailwind-merge"

export interface ButtonProps
  extends React.ComponentProps<typeof HeadlessButton> {
  variant?: "primary" | "secondary" | "outline" | "link"
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className,
  ...props
}) => {
  const {colors} = useTheme()

  const baseStyles =
    "flow-px-4 flow-py-2 flow-rounded-md flow-font-medium flow-transition-colors"

  const variantStyles = {
    primary: twMerge(
      colors.primary,
      colors.primaryForeground,
      "hover:flow-opacity-90"
    ),
    secondary: twMerge(
      colors.secondary,
      colors.secondaryForeground,
      "hover:flow-opacity-90"
    ),
    outline: twMerge(
      "flow-bg-transparent",
      colors.foreground,
      "flow-border",
      colors.border,
      "hover:flow-bg-slate-100 dark:hover:flow-bg-slate-800"
    ),
    link: twMerge(
      "flow-bg-transparent",
      colors.link,
      "hover:flow-underline"
    ),
  }

  return (
    <HeadlessButton
      className={twMerge(baseStyles, variantStyles[variant], className)}
      {...props}
    />
  )
}
