import {ComponentChildren} from "preact"

export function Dialog({
  isOpen,
  onOpenChange,
  children,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  children: ComponentChildren
}) {
  return (
    <div
      class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
      open={isOpen}
    >
      <div class="flex flex-col items-center bg-white gap-8 p-8 rounded-md max-w-md w-full shadow-md">
        <button
          class="bg-none border-none text-2xl absolute top-0 right-0"
          onClick={() => onOpenChange(false)}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  )
}
