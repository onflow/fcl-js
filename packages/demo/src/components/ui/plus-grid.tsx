import {type ReactNode} from "react"

interface PlusGridProps {
  className?: string
  children: ReactNode
}

interface PlusGridIconProps {
  className?: string
  placement: `${"top" | "bottom"} ${"right" | "left"}`
}

export function PlusGrid({className = "", children}: PlusGridProps) {
  return <div className={className}>{children}</div>
}

export function PlusGridRow({className = "", children}: PlusGridProps) {
  return (
    <div
      className={`group/row relative isolate pt-[calc(0.5rem+1px)] last:pb-[calc(0.5rem+1px)]
        ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 right-0 -z-10"
      >
        <div className="absolute inset-x-0 top-0 border-t border-black/5 dark:border-white/10"></div>
        <div className="absolute inset-x-0 top-2 border-t border-black/5 dark:border-white/10"></div>
        <div
          className="absolute inset-x-0 bottom-0 hidden border-b border-black/5 dark:border-white/10
            group-last/row:block"
        ></div>
        <div
          className="absolute inset-x-0 bottom-2 hidden border-b border-black/5 dark:border-white/10
            group-last/row:block"
        ></div>
      </div>
      {children}
    </div>
  )
}

export function PlusGridItem({className = "", children}: PlusGridProps) {
  return (
    <div className={`group/item relative ${className}`}>
      <PlusGridIcon
        placement="top left"
        className="hidden group-first/item:block"
      />
      <PlusGridIcon placement="top right" />
      <PlusGridIcon
        placement="bottom left"
        className="hidden group-first/item:group-last/row:block"
      />
      <PlusGridIcon
        placement="bottom right"
        className="hidden group-last/row:block"
      />
      {children}
    </div>
  )
}

export function PlusGridIcon({className = "", placement}: PlusGridIconProps) {
  const [yAxis, xAxis] = placement.split(" ")

  const yClass = yAxis === "top" ? "-top-2" : "-bottom-2"
  const xClass = xAxis === "left" ? "-left-2" : "-right-2"

  return (
    <svg
      viewBox="0 0 15 15"
      aria-hidden="true"
      className={`absolute size-[15px] fill-black/10 dark:fill-white/20 ${yClass} ${xClass}
        ${className}`}
    >
      <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
    </svg>
  )
}
