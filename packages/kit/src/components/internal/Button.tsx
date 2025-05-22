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

  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors"
  const variantStyles = {
    primary: colors.primary,
    secondary: colors.secondary,
    outline: colors.outline,
    link: colors.link,
  }

  return (
    <HeadlessButton
      className={twMerge(baseStyles, variantStyles[variant], className)}
      {...props}
    />
  )
}
