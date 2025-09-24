import {type ReactNode, memo} from "react"
import {PlusGridItem, PlusGridIcon} from "./plus-grid"
import {useDarkMode} from "../flow-provider-wrapper"

interface DemoCardProps {
  id: string
  title: string
  description: string
  children: ReactNode
  className?: string
}

export const DemoCard = memo<DemoCardProps>(function DemoCard({
  id,
  title,
  description,
  children,
  className = "",
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
