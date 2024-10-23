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
  const [isClosing, setIsClosing] = useState(false)

  function aninmateClose() {
    if (isClosing) return
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 300)
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center"
      onClick={aninmateClose}
    >
      <div
        className={`bg-white w-full max-w-lg rounded-t-2xl p-6 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } ${isClosing ? "translate-y-full" : ""}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center items-center mb-6 relative">
          <h2 className="text-lg font-semibold text-center">{title}</h2>
          <button
            onClick={aninmateClose}
            aria-label="Close drawer"
            class="absolute top-0 right-0"
          >
            &times;
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
