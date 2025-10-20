import {Component, type ReactNode, type ErrorInfo} from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {hasError: false}
  }

  static getDerivedStateFromError(error: Error): State {
    return {hasError: true, error}
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            className="flex flex-col items-center justify-center p-8 border border-red-200
              dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20"
          >
            <svg
              className="w-12 h-12 text-red-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
              Something went wrong
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400 text-center max-w-md">
              {this.state.error?.message ||
                "An unexpected error occurred. Please refresh the page to try again."}
            </p>
            <button
              onClick={() => this.setState({hasError: false})}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700
                transition-colors"
            >
              Try Again
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
