export function StarterBanner() {
  return (
    <div className="relative group/banner mb-8">
      <svg
        viewBox="0 0 15 15"
        aria-hidden="true"
        className="absolute size-[15px] fill-black/10 dark:fill-white/20 -top-2 -left-2"
      >
        <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
      </svg>
      <svg
        viewBox="0 0 15 15"
        aria-hidden="true"
        className="absolute size-[15px] fill-black/10 dark:fill-white/20 -top-2 -right-2"
      >
        <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
      </svg>
      <svg
        viewBox="0 0 15 15"
        aria-hidden="true"
        className="absolute size-[15px] fill-black/10 dark:fill-white/20 -bottom-2 -left-2"
      >
        <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
      </svg>
      <svg
        viewBox="0 0 15 15"
        aria-hidden="true"
        className="absolute size-[15px] fill-black/10 dark:fill-white/20 -bottom-2 -right-2"
      >
        <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
      </svg>

      <div
        className="relative overflow-hidden rounded-xl border border-flow-primary/20
          bg-gradient-to-r from-flow-50 to-emerald-50 dark:from-flow-900/20
          dark:to-emerald-900/20 p-6"
      >
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Looking for a starter?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Try our Next.js starter template with Flow React SDK
              pre-configured and ready to be used.
            </p>
          </div>

          <a
            href="https://github.com/onflow/flow-react-sdk-starter"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
              font-semibold text-sm bg-flow-primary hover:bg-flow-primary/90 text-gray-900
              transition-colors duration-200"
          >
            View Starter
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
