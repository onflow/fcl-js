import {useDarkMode} from "../flow-provider-wrapper"
import type {PropDefinition} from "./demo-card"

interface PropsViewerProps {
  props: PropDefinition[]
}

export function PropsViewer({props}: PropsViewerProps) {
  const {darkMode} = useDarkMode()

  return (
    <div className="relative">
      <div
        className={`flex items-center px-6 py-3 border-b
          ${darkMode ? "border-white/10" : "border-black/5"}`}
      >
        <div className="flex items-center space-x-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={darkMode ? "text-gray-400" : "text-gray-600"}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <path d="M9 9h6v6h-6z" />
          </svg>
          <span
            className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Props
          </span>
        </div>
      </div>

      <div className={`p-6 ${darkMode ? "bg-gray-900/50" : "bg-gray-50"}`}>
        <div className="space-y-4">
          {props.map((prop, index) => (
            <div
              key={prop.name}
              className={`p-4 rounded-lg border ${
              darkMode
                  ? "bg-gray-800/50 border-white/10"
                  : "bg-white border-black/5"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <code
                    className={`text-sm font-semibold px-2 py-1 rounded ${
                    darkMode
                        ? "bg-gray-700 text-flow-primary"
                        : "bg-gray-100 text-flow-600"
                    }`}
                  >
                    {prop.name}
                  </code>
                  {prop.required && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      darkMode
                          ? "bg-red-900/30 text-red-400"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      required
                    </span>
                  )}
                </div>

                <code
                  className={`text-sm px-2 py-1 rounded ${
                  darkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {prop.type}
                </code>
              </div>

              {prop.description && (
                <p
                  className={`text-sm mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  {prop.description}
                </p>
              )}

              {prop.defaultValue && (
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    Default:
                  </span>
                  <code
                    className={`text-xs px-1.5 py-0.5 rounded ${
                    darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {prop.defaultValue}
                  </code>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
