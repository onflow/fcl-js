import React from "react"
import {Dialog as HeadlessDialog} from "@headlessui/react"
import {useTheme} from "../../core/theme"
import {twMerge} from "tailwind-merge"
import {XIcon} from "../../icons/XIcon"

export interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  const {colors} = useTheme()

  return (
    <HeadlessDialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <HeadlessDialog.Panel
          className={twMerge(
            "w-full max-w-md rounded-lg bg-white p-6 shadow-xl",
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            {title && (
              <HeadlessDialog.Title
                className={twMerge("text-lg font-semibold text-slate-900")}
              >
                {title}
              </HeadlessDialog.Title>
            )}
            <button
              onClick={onClose}
              className={twMerge(
                `p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-500
                hover:text-slate-700`
              )}
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mt-2 text-slate-700">{children}</div>
        </HeadlessDialog.Panel>
      </div>
    </HeadlessDialog>
  )
}
