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
            "w-full max-w-md rounded-lg bg-white dark:bg-slate-800 p-6 shadow-xl relative",
            className
          )}
        >
          {/* Close button absolutely positioned */}
          <button
            onClick={onClose}
            className={twMerge(
              `absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100
              dark:hover:bg-slate-700 transition-colors text-slate-500 hover:text-slate-700
              dark:text-slate-400 dark:hover:text-slate-200`
            )}
            aria-label="Close"
          >
            <XIcon className="w-5 h-5" />
          </button>

          {/* Header only if title is present */}
          {title && (
            <div className="mb-4">
              <HeadlessDialog.Title
                className={twMerge(
                  "text-lg font-semibold text-slate-900 dark:text-slate-100"
                )}
              >
                {title}
              </HeadlessDialog.Title>
            </div>
          )}

          {/* Content starts at the top */}
          <div className="mt-2 text-slate-700 dark:text-slate-300">
            {children}
          </div>
        </HeadlessDialog.Panel>
      </div>
    </HeadlessDialog>
  )
}
