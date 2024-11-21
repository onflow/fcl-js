import {NotificationInfo} from "../../types/types"
import {isMobile} from "../../utils"

export function Notification({
  title,
  message,
  icon,
  onClick,
  onDismiss,
  animate,
}: NotificationInfo & {animate?: boolean}) {
  return (
    <div
      className={`fixed bottom-3 left-3 right-3 mx-auto z-[2147483647] flex max-w-sm
        overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-lg
        md:bottom-4 md:left-auto md:right-4 dark:bg-gray-700 dark:border-gray-600
        ${animate ? "animate-slideUp" : ""}`}
      role="alert"
      onClick={e => {
        if (onClick) {
          e.stopPropagation()
          onClick?.()
        }
      }}
    >
      {icon && (
        <img
          className="h-10 w-10 self-center rounded-md md:self-start"
          src={icon}
          alt={title}
        />
      )}
      <div className="ml-3 grow">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {title}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
          {message}
        </p>
      </div>

      <button
        className={`ml-2 inline-flex rounded-full text-gray-400 hover:text-gray-500 focus:ring-0
          dark:text-gray-200 dark:hover:text-gray-300 ${
          isMobile()
              ? "self-center p-2"
              : "self-start p-0 bg-transparent border-transparent focus:border-transparent"
          }`}
        onClick={e => {
          e.stopPropagation()
          onDismiss?.()
        }}
      >
        <span className="sr-only">Close</span>
        <svg
          className={"h-5 w-5"}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M14.354 5.646a.5.5 0 00-.708 0L10 9.293 5.354 4.646a.5.5 0 00-.708.708L9.293 10l-4.647 4.646a.5.5 0 00.708.708L10 10.707l4.646 4.647a.5.5 0 00.708-.708L10.707 10l4.647-4.646a.5.5 0 000-.708z"
          />
        </svg>
      </button>
    </div>
  )
}
