import {type ReactNode, memo, useState, useRef, useEffect} from "react"
import {PlusGridItem, PlusGridIcon} from "./plus-grid"
import {useDarkMode} from "../flow-provider-wrapper"
import {CodeViewer} from "./code-viewer"
import {PropsViewer} from "./props-viewer"

export interface PropDefinition {
  name: string
  type: string
  required?: boolean
  description?: string
  defaultValue?: string
}

interface DemoCardProps {
  id: string
  title: ReactNode
  description: ReactNode
  children: ReactNode
  className?: string
  code?: string
  props?: PropDefinition[]
  docsUrl?: string
}

export const DemoCard = memo<DemoCardProps>(function DemoCard({
  id,
  title,
  description,
  children,
  className = "",
  code,
  props,
  docsUrl,
}) {
  const {darkMode} = useDarkMode()
  const [showCode, setShowCode] = useState(false)
  const [showProps, setShowProps] = useState(false)
  const codeRef = useRef<HTMLDivElement>(null)
  const propsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (showCode && codeRef.current) {
      setTimeout(() => {
        codeRef.current?.scrollIntoView({behavior: "smooth", block: "nearest"})
      }, 100)
    }
  }, [showCode])

  useEffect(() => {
    if (showProps && propsRef.current) {
      setTimeout(() => {
        propsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
      }, 100)
    }
  }, [showProps])

  return (
    <div id={id} className={`scroll-mt-[60px] ${className}`}>
      <PlusGridItem className="mb-12">
        <div
          className={`relative overflow-hidden border rounded-xl transition-all duration-300
            hover:shadow-xl max-w-full ${
            darkMode
                ? "bg-gray-800/50 border-white/10 hover:border-white/20"
                : "bg-white border-black/5 hover:border-black/10"
            }`}
        >
          <PlusGridIcon placement="top left" className="absolute z-10" />
          <PlusGridIcon placement="top right" className="absolute z-10" />
          <PlusGridIcon placement="bottom left" className="absolute z-10" />
          <PlusGridIcon placement="bottom right" className="absolute z-10" />

          {(code || props) && (
            <div className="absolute top-4 right-4 md:top-6 md:right-8 z-20 flex items-center">
              <div className="flex items-center space-x-1 md:space-x-2">
                {props && (
                  <button
                    onClick={() => {
                      setShowProps(!showProps)
                      setShowCode(false)
                    }}
                    className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1.5 md:py-2 rounded-md
                    text-xs md:text-sm font-medium transition-colors ${
                    showProps
                        ? darkMode
                          ? "bg-flow-primary/20 text-flow-primary border border-flow-primary/30"
                          : "bg-flow-primary/10 text-flow-600 border border-flow-primary/20"
                        : darkMode
                          ? "bg-gray-700/80 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
                    }`}
                    aria-label="Show props"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <path d="M9 9h6v6h-6z" />
                    </svg>
                    <span className="hidden md:inline">Props</span>
                  </button>
                )}

                {code && (
                  <button
                    onClick={() => {
                      setShowCode(!showCode)
                      setShowProps(false)
                    }}
                    className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1.5 md:py-2 rounded-md
                    text-xs md:text-sm font-medium transition-colors ${
                    showCode
                        ? darkMode
                          ? "bg-flow-primary/20 text-flow-primary border border-flow-primary/30"
                          : "bg-flow-primary/10 text-flow-600 border border-flow-primary/20"
                        : darkMode
                          ? "bg-gray-700/80 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
                    }`}
                    aria-label="Show code"
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
                    <span className="hidden md:inline">Code</span>
                  </button>
                )}
              </div>
            </div>
          )}

          <div
            className={`px-4 md:px-8 py-4 md:py-6 border-b
              ${darkMode ? "border-white/10" : "border-black/5"}`}
          >
            <div className={`${code || props ? "pr-20 md:pr-32" : ""}`}>
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                <h3
                  className={`group text-lg md:text-2xl font-bold tracking-tight font-mono ${
                    darkMode ? "text-white" : "text-gray-900" }`}
                >
                  <a
                    href={`#${id}`}
                    className="inline-flex items-center gap-2 no-underline hover:no-underline"
                  >
                    {title}
                    <span
                      className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                        darkMode ? "text-gray-500" : "text-gray-400" }`}
                    >
                      #
                    </span>
                  </a>
                </h3>

                {docsUrl && (
                  <a
                    href={docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 rounded-full text-xs
                    font-medium transition-colors ${
                    darkMode
                        ? `text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-600/50 border
                          border-white/10 hover:border-white/20`
                        : `text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 border
                          border-black/10 hover:border-black/20`
                    }`}
                    aria-label="View documentation"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15,3 21,3 21,9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    <span className="hidden sm:inline">DOCS</span>
                  </a>
                )}
              </div>
              <div
                className={`mt-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                {description}
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6">{children}</div>

          {showCode && code && (
            <div
              ref={codeRef}
              className={`border-t ${darkMode ? "border-white/10" : "border-black/5"}`}
            >
              <CodeViewer code={code} noBorder />
            </div>
          )}

          {showProps && props && (
            <div
              ref={propsRef}
              className={`border-t ${darkMode ? "border-white/10" : "border-black/5"}`}
            >
              <PropsViewer props={props} />
            </div>
          )}
        </div>
      </PlusGridItem>
    </div>
  )
})
