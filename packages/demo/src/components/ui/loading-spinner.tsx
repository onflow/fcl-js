import {memo} from "react"
import {useDarkMode} from "../flow-provider-wrapper"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export const LoadingSpinner = memo<LoadingSpinnerProps>(
  function LoadingSpinner({size = "md", className = ""}) {
    const {darkMode} = useDarkMode()

    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-8 h-8",
      lg: "w-12 h-12",
    }

    return (
      <div
        className={`inline-block animate-spin rounded-full border-2 border-solid border-current
          border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]
          ${sizeClasses[size]} ${darkMode ? "text-white" : "text-gray-900"} ${className}`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    )
  }
)

interface LoadingStateProps {
  message?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export const LoadingState = memo<LoadingStateProps>(function LoadingState({
  message = "Loading...",
  size = "md",
  className = "",
}) {
  const {darkMode} = useDarkMode()

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 ${className}`}
    >
      <LoadingSpinner size={size} />
      <p
        className={`mt-4 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
      >
        {message}
      </p>
    </div>
  )
})
