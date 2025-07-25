import React from "react"
import {useDarkMode} from "../../provider/DarkModeProvider"

export interface StyleWrapperProps {
  children: React.ReactNode
  className?: string
}

/**
 * Internal wrapper component that ensures React SDK components have access to
 * their scoped Tailwind styles by wrapping them in flow-wrapper class
 */
export const StyleWrapper: React.FC<StyleWrapperProps> = ({
  children,
  className,
}) => {
  const {isDark} = useDarkMode()

  return (
    <div
      className={`flow-wrapper ${isDark ? "flow-dark" : ""} ${className || ""}`}
    >
      {children}
    </div>
  )
}
