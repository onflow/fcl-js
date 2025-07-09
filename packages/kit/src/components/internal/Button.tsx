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
  const buttonVariant = colors[variant]

  const baseStyles =
    "flow-px-4 flow-py-2 flow-rounded-md flow-font-medium flow-transition-colors"

  const variantClasses = twMerge(
    buttonVariant.background,
    buttonVariant.text,
    buttonVariant.hover,
    buttonVariant.border
  )

  return (
    <HeadlessButton
      className={twMerge(baseStyles, variantClasses, className)}
      {...props}
    />
  )
}
