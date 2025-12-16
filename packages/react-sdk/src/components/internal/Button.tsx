import React from "react"
import {Button as HeadlessButton} from "@headlessui/react"
import {useTheme, getButtonStyles, ButtonVariant} from "../../core/theme"
import {twMerge} from "tailwind-merge"

export interface ButtonProps
  extends React.ComponentProps<typeof HeadlessButton> {
  variant?: ButtonVariant
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className,
  ...props
}) => {
  const {colors} = useTheme()
  const buttonStyles = getButtonStyles(colors, variant)

  const baseStyles =
    "flow-px-4 flow-py-2 flow-rounded-md flow-font-medium flow-transition-colors"

  const variantClasses = twMerge(
    buttonStyles.background,
    buttonStyles.text,
    buttonStyles.hover,
    buttonStyles.border
  )

  return (
    <HeadlessButton
      className={twMerge(baseStyles, variantClasses, className)}
      {...props}
    />
  )
}
