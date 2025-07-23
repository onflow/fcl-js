import React from "react"
import {Dialog as HeadlessDialog} from "@headlessui/react"
import {useTheme} from "../../core/theme"
import {useDarkMode} from "../../provider/DarkModeProvider"
import {twMerge} from "tailwind-merge"
import {XIcon} from "../../icons/XIcon"
import {Button} from "./Button"

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
  const {isDark} = useDarkMode()

  // NB: flow-wrapper class must be applied to headlessdialog directly to avoid positioning issues
  return (
    <HeadlessDialog
      open={isOpen}
      onClose={onClose}
      className={`flow-wrapper ${isDark ? "flow-dark" : ""} flow-relative flow-z-50`}
    >
      {/* Background overlay */}
      <div
        className="flow-fixed flow-inset-0 flow-bg-black/30"
        aria-hidden="true"
      />

      {/* Full-screen container to center the panel */}
      <div className="flow-fixed flow-inset-0 flow-flex flow-items-center flow-justify-center flow-p-4">
        <HeadlessDialog.Panel
          className={twMerge(
            `flow-w-full flow-max-w-md flow-rounded-lg flow-bg-white dark:flow-bg-slate-800
            flow-p-6 flow-shadow-xl flow-relative`,
            className
          )}
        >
          {/* Close button absolutely positioned */}
          <Button
            variant="outline"
            onClick={onClose}
            className={twMerge(
              "flow-absolute flow-top-4 flow-right-4 flow-rounded-full flow-p-2"
            )}
            aria-label="Close"
          >
            <XIcon className="flow-w-4 flow-h-4" />
          </Button>

          {/* Header only if title is present */}
          {title && (
            <div className="flow-mb-4">
              <HeadlessDialog.Title
                className={twMerge(
                  "flow-text-lg flow-font-semibold flow-text-slate-900 dark:flow-text-slate-100"
                )}
              >
                {title}
              </HeadlessDialog.Title>
            </div>
          )}

          {/* Content starts at the top */}
          <div className="flow-mt-2 flow-text-slate-700 dark:flow-text-slate-300">
            {children}
          </div>
        </HeadlessDialog.Panel>
      </div>
    </HeadlessDialog>
  )
}
