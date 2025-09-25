import {useState} from "react"
import {useDarkMode} from "../flow-provider-wrapper"

interface CodeViewerProps {
  code: string
}

export function CodeViewer({code}: CodeViewerProps) {
  const {darkMode} = useDarkMode()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  return (
    <div className="relative">
      <div
        className={`flex items-center justify-between px-6 py-3 border-b
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
            <polyline points="16,18 22,12 16,6" />
            <polyline points="8,6 2,12 8,18" />
          </svg>
          <span
            className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Implementation
          </span>
        </div>

        <button
          onClick={handleCopy}
          className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded
            transition-colors ${
            copied
                ? darkMode
                  ? "bg-green-900/30 text-green-400"
                  : "bg-green-100 text-green-700"
                : darkMode
                  ? "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
            }`}
        >
          {copied ? (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div
        className={`p-6 overflow-x-auto ${darkMode ? "bg-gray-900/50" : "bg-gray-50"}`}
      >
        <pre
          className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-800"}`}
        >
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}
