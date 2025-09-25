import {type ReactNode, memo, useState} from "react"
import {PlusGridItem, PlusGridIcon} from "./plus-grid"
import {useDarkMode} from "../flow-provider-wrapper"
import {CodeViewer} from "./code-viewer"

interface DemoCardProps {
  id: string
  title: string
  description: string
  children: ReactNode
  className?: string
  code?: string
}

export const DemoCard = memo<DemoCardProps>(function DemoCard({
  id,
  title,
  description,
  children,
  className = "",
  code,
}) {
  const {darkMode} = useDarkMode()
  const [showCode, setShowCode] = useState(false)

  return (
    <div id={id} className={`scroll-mt-24 ${className}`}>
      <PlusGridItem className="mb-12">
        <div
          className={`relative overflow-hidden border rounded-xl transition-all duration-300
            hover:shadow-xl ${
            darkMode
                ? "bg-gray-800/50 border-white/10 hover:border-white/20"
                : "bg-white border-black/5 hover:border-black/10"
            }`}
        >
          <PlusGridIcon placement="top left" className="absolute z-10" />
          <PlusGridIcon placement="top right" className="absolute z-10" />
          <PlusGridIcon placement="bottom left" className="absolute z-10" />
          <PlusGridIcon placement="bottom right" className="absolute z-10" />

          {code && (
            <div className="absolute top-6 right-8 z-20 flex items-center h-16">
              <button
                onClick={() => setShowCode(!showCode)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium
                transition-colors ${
                darkMode
                    ? "bg-gray-700/80 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="16,18 22,12 16,6" />
                  <polyline points="8,6 2,12 8,18" />
                </svg>
                <span>Code</span>
              </button>
            </div>
          )}

          <div
            className={`px-8 py-6 border-b ${darkMode ? "border-white/10" : "border-black/5"}`}
          >
            <h3
              className={`text-2xl font-bold tracking-tight font-mono ${
                darkMode ? "text-white" : "text-gray-900" }`}
            >
              {title}
            </h3>
            <p
              className={`mt-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              {description}
            </p>
          </div>

          <div className="p-6">{children}</div>

          {showCode && code && (
            <div
              className={`border-t ${darkMode ? "border-white/10" : "border-black/5"}`}
            >
              <CodeViewer code={code} />
            </div>
          )}
        </div>
      </PlusGridItem>
    </div>
  )
})
