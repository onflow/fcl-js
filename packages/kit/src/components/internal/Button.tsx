import React from "react"
import {Button as HeadlessButton} from "@headlessui/react"
import {useTheme} from "../../core/theme"
import {twMerge} from "tailwind-merge"

export interface ButtonProps extends React.ComponentProps<typeof HeadlessButton> {
  variant?: "primary" | "secondary"
}

export const Button: React.FC<ButtonProps> = ({variant = "primary", className, ...props}) => {
  const theme = useTheme()

  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors"
  const variantStyles = {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
  }

  return (
    <HeadlessButton
      className={twMerge(baseStyles, variantStyles[variant], className)}
      {...props}
    />
  )
} 