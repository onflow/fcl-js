import {JsonViewer} from "./json-viewer"

interface ResultsSectionProps {
  data: any
  darkMode: boolean
  show: boolean
  title?: string
}

export function ResultsSection({
  data,
  darkMode,
  show,
  title = "Hook Data",
}: ResultsSectionProps) {
  if (!show) return null

  return (
    <>
      <div
        className={`-mx-6 h-px ${darkMode ? "bg-white/10" : "bg-black/10"}`}
      />

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div
            className={`p-1.5 rounded ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={darkMode ? "text-gray-400" : "text-gray-600"}
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10,9 9,9 8,9"></polyline>
            </svg>
          </div>
          <h4
            className={`text-sm font-semibold uppercase tracking-wider ${
              darkMode ? "text-gray-200" : "text-gray-700" }`}
          >
            Hook Response
          </h4>
        </div>

        <JsonViewer
          data={data}
          darkMode={darkMode}
          title={title}
          height="h-80"
        />
      </div>
    </>
  )
}
