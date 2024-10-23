import {ComponentChildren} from "preact"
import {useState} from "preact/hooks"

export function Dialog({
  title,
  isOpen,
  onClose,
  children,
}: {
  title: string
  isOpen: boolean
  onClose: () => void
  children: ComponentChildren
}) {
  const [isClosing, setIsClosing] = useState(false)

  function animateClose() {
    if (isClosing) return
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 300)
  }

  return (
    <div
      class={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      } ${isClosing ? "opacity-0 pointer-events-none" : ""}`}
      open={isOpen}
      onClick={animateClose}
    >
      <div
        class="flex flex-col items-center bg-white gap-8 p-8 rounded-md max-w-sm w-full shadow-md relative"
        onClick={e => e.stopPropagation()}
      >
        <div class="flex items-center justify-center w-full gap-8">
          <h2 class="text-lg font-semibold">{title}</h2>
          <button
            class="absolute top-0 right-0 w-10 h-10 bg-transparent border-none text-black text-2xl flex items-center justify-center cursor-pointer hover:bg-gray-200 focus:outline-none"
            onClose={animateClose}
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
