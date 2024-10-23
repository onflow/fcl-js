import {useState, useEffect, useRef} from "preact/hooks"
import {ComponentChildren} from "preact"

interface BottomDrawerProps {
  title: string
  isOpen: boolean
  onClose: () => void
  children: ComponentChildren
}

export function Drawer({
  title,
  isOpen = false,
  onClose = () => {},
  children,
}: BottomDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className={`bg-white w-full max-w-lg rounded-t-xl p-6 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close drawer">
            X
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
