import {useState} from "react"
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter"
import {oneDark, oneLight} from "react-syntax-highlighter/dist/esm/styles/prism"
import {useDarkMode} from "../flow-provider-wrapper"

interface CodeViewerProps {
  code: string
  language?: string
  noBorder?: boolean
}

export function CodeViewer({
  code,
  language = "tsx",
  noBorder = false,
}: CodeViewerProps) {
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
    <div
      className={`relative rounded-lg overflow-hidden
        ${!noBorder ? `border ${darkMode ? "border-white/10" : "border-black/5"}` : ""}`}
    >
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

      <div>
        <SyntaxHighlighter
          language={language}
          style={darkMode ? oneDark : oneLight}
          customStyle={{
            margin: 0,
            padding: "1.5rem",
            fontSize: "0.875rem",
            lineHeight: "1.5",
            background: darkMode
              ? "rgba(17, 24, 39, 0.5)"
              : "rgb(249, 250, 251)",
          }}
          codeTagProps={{
            style: {
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
