import {useState} from "react"

interface JsonViewerProps {
  data: any
  darkMode: boolean
  height?: string
  title?: string
}

export function JsonViewer({
  data,
  darkMode,
  height = "h-64",
  title = "JSON Data",
}: JsonViewerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div
      className={`relative rounded-lg border ${
        darkMode
          ? "bg-gray-900/50 border-white/10"
          : "bg-gray-50 border-black/5"
        }`}
    >
      <div
        className={`flex items-center justify-between px-4 py-3 border-b ${
          darkMode ? "border-white/10" : "border-black/5" }`}
      >
        <h4
          className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          {title}
        </h4>
        <button
          onClick={handleCopy}
          className={`px-3 py-1 text-xs font-medium rounded transition-all duration-200 ${
            copied
              ? darkMode
                ? "bg-green-900/50 text-green-400"
                : "bg-green-100 text-green-600"
              : darkMode
                ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-700"
            }`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className={`${height} overflow-auto`}>
        <pre
          className={`p-4 text-xs font-mono leading-relaxed whitespace-pre-wrap break-all ${
            darkMode ? "text-gray-300" : "text-gray-700" }`}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  )
}
