import {type ReactNode, memo} from "react"
import {PlusGridItem, PlusGridIcon} from "./plus-grid"
import {useDarkMode} from "../flow-provider-wrapper"

interface DemoCardProps {
  id: string
  title: string
  description: string
  children: ReactNode
  className?: string
  type?: "hook" | "component"
}

export const DemoCard = memo<DemoCardProps>(function DemoCard({
  id,
  title,
  description,
  children,
  className = "",
  type,
}) {
  const {darkMode} = useDarkMode()

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

          {type && (
            <div className="absolute top-6 right-8 z-20 flex items-center h-16">
              <div
                className={`p-2 rounded-md ${
                darkMode
                    ? "bg-gray-700/80 text-gray-400"
                    : "bg-gray-100 text-gray-600"
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
                  {type === "hook" ? (
                    <>
                      <path d="M12 2v6" strokeLinecap="round" />
                      <path
                        d="M12 8a6 6 0 0 1 6 6 6 6 0 0 1-6 6 6 6 0 0 1-6-6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6 14a2 2 0 0 0 2 2 2 2 0 0 0 2-2"
                        strokeLinecap="round"
                      />
                    </>
                  ) : (
                    <>
                      <rect x="2" y="2" width="8" height="8" rx="1" />
                      <rect x="14" y="2" width="8" height="8" rx="1" />
                      <rect x="2" y="14" width="8" height="8" rx="1" />
                      <rect x="14" y="14" width="8" height="8" rx="1" />
                    </>
                  )}
                </svg>
              </div>
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
        </div>
      </PlusGridItem>
    </div>
  )
})
